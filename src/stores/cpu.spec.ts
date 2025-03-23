import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCpuStore } from '@/stores/cpu'

const TWO_MINUTES = 120_000
const NOW = Date.now()

describe('useCpuStore alerting logic', () => {
  let store: ReturnType<typeof useCpuStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useCpuStore()

    store.cpuHistory = []
    store.alertHistory = []
    store.isUnderHeavyLoad = false
    store.highLoadItem = null
    store.recoveryItem = null
  })

  it('should not trigger heavy load if high load < 2 minutes', () => {
    store.newEvent({
      normalizedLoadAverage: 1.2,
      timestamp: NOW,
    })

    // Second event still less than 2 minutes after
    store.newEvent({
      normalizedLoadAverage: 1.3,
      timestamp: NOW + TWO_MINUTES - 5000,
    })

    expect(store.isUnderHeavyLoad).toBe(false)
    expect(store.alertHistory.length).toBe(0)
  })

  it('should trigger heavy load if sustained > 1 load for 2 minutes', () => {
    const start = NOW

    store.newEvent({
      normalizedLoadAverage: 1.4,
      timestamp: start,
    })

    store.newEvent({
      normalizedLoadAverage: 1.5,
      timestamp: start + TWO_MINUTES + 1000,
    })

    expect(store.isUnderHeavyLoad).toBe(true)
    expect(store.alertHistory.length).toBe(1)
    expect(store.alertHistory[0].startTimestamp).toBeGreaterThanOrEqual(start)
  })

  it('should not recover if load < 1 but not sustained for 2 minutes', () => {
    store.isUnderHeavyLoad = true
    store.alertHistory.unshift({
      startTimestamp: NOW,
      startAverageLoad: 1.4,
    })

    const recoveryAttempt = {
      normalizedLoadAverage: 0.8,
      timestamp: NOW + TWO_MINUTES + 5000,
    }

    store.newEvent(recoveryAttempt)

    // Only one low-load event, not sustained enough
    store.newEvent({
      normalizedLoadAverage: 0.9,
      timestamp: recoveryAttempt.timestamp + (TWO_MINUTES - 20_000),
    })

    expect(store.isUnderHeavyLoad).toBe(true)
    expect(store.alertHistory[0].endTimestamp).toBeUndefined()
  })

  it('should recover after sustained low load < 1 for 2 minutes', () => {
    store.isUnderHeavyLoad = true
    store.alertHistory.unshift({
      startTimestamp: NOW,
      startAverageLoad: 1.4,
    })

    const recoveryStart = {
      normalizedLoadAverage: 0.7,
      timestamp: NOW + TWO_MINUTES + 5000,
    }

    store.newEvent(recoveryStart)

    // sustained below threshold
    const sustainedRecovery = {
      normalizedLoadAverage: 0.6,
      timestamp: recoveryStart.timestamp + TWO_MINUTES + 500,
    }

    store.newEvent(sustainedRecovery)

    expect(store.isUnderHeavyLoad).toBe(false)
    expect(store.alertHistory[0].endTimestamp).toBe(sustainedRecovery.timestamp)
    expect(store.alertHistory[0].endAverageLoad).toBeCloseTo(0.6, 1)
  })

  it('should ignore load exactly equal to 1', () => {
    store.newEvent({
      normalizedLoadAverage: 1.0,
      timestamp: NOW,
    })

    expect(store.isUnderHeavyLoad).toBe(false)
    expect(store.alertHistory.length).toBe(0)
  })

  it('should clean old cpuHistory items older than 10 minutes', () => {
    // Add an old record
    store.cpuHistory.unshift({
      normalizedLoadAverage: 0.9,
      timestamp: NOW - 11 * 60 * 1000, // 11 minutes old
    })

    store.newEvent({
      normalizedLoadAverage: 0.9,
      timestamp: NOW,
    })

    expect(store.cpuHistory.length).toBe(1) // Only fresh record should remain
    expect(store.cpuHistory[0].timestamp).toBe(NOW)
  })
})

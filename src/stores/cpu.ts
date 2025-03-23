import { ref } from 'vue'
import { defineStore } from 'pinia'
import getSocket from '@/composables/socket'

export const useCpuStore = defineStore(
  'cpu',
  () => {
    const RECORDS_WINDOW = 10 // How many minutes
    const DURATION_THRESHOLD_ML = 120000 // Time threshold to change CPU state
    const UPDATE_TIMESPAN_ML = 10000 // Get CPU load information every 10 seconds
    const RECORDS_WINDOW_MS = RECORDS_WINDOW * 60 * 1000
    const HIGH_AVERAGE_THRESHOLD = 1
    const isUnderHeavyLoad = ref<boolean>(false)
    const highLoadItem = ref<CpuItem | null>(null)
    const recoveryItem = ref<CpuItem | null>(null)
    const cpuHistory = ref<CpuItem[]>([])
    const alertHistory = ref<AlertItem[]>([])

    function bindEvents() {
      const socket = getSocket()

      socket.on('cpu-load', newEvent)
    }

    function newEvent(data: CpuItem) {
      // leave if it haven't passed 10 seconds (eg. refresh)
      if (
        cpuHistory.value.length &&
        data.timestamp - cpuHistory.value[0].timestamp < UPDATE_TIMESPAN_ML
      ) {
        return
      }

      cleanOutdatedHistory()
      cpuHistory.value.unshift(data)
      checkHeavyLoad()
    }

    /**
     * Clean history if items are older than 10 minutes
     */
    function cleanOutdatedHistory() {
      /**
       * if RECORDS_WINDOW was bigger (eg hours or days) we could use a different method to clean old history
       * so that we don't filter the array every 10 seconds eg.:
       *
       * const MAX_RECORDS = (RECORDS_WINDOW * 60 * 1000) / UPDATE_TIMESPAN_ML;
       * if (cpuHistory.value.length === (MAX_RECORDS)) {
       *   cpuHistory.value.pop();
       * }
       */
      const currentTimestamp = Date.now()
      cpuHistory.value = cpuHistory.value.filter(
        (item) => currentTimestamp - item.timestamp < RECORDS_WINDOW_MS,
      )

      alertHistory.value = alertHistory.value.filter(
        (item) => !item.endTimestamp || currentTimestamp - item.endTimestamp < RECORDS_WINDOW_MS,
      )
    }

    function handleHeavyLoad(item: CpuItem) {
      if (isUnderHeavyLoad.value) {
        recoveryItem.value = null

        return
      }

      if (!highLoadItem.value) {
        recoveryItem.value = null
        highLoadItem.value = item
        //alertHistory.value.unshift({ ...item, isTemporary: true });

        return
      }

      if (item.timestamp - highLoadItem.value.timestamp < DURATION_THRESHOLD_ML) {
        return
      }

      isUnderHeavyLoad.value = true
      alertHistory.value.unshift({
        startTimestamp: item.timestamp,
        startAverageLoad: item.normalizedLoadAverage,
      })
    }

    function handleAverageLoad(item: CpuItem) {
      if (!isUnderHeavyLoad.value) {
        highLoadItem.value = null

        return
      }

      if (!recoveryItem.value) {
        highLoadItem.value = null
        recoveryItem.value = item

        return
      }

      if (item.timestamp - recoveryItem.value.timestamp < DURATION_THRESHOLD_ML) {
        return
      }

      isUnderHeavyLoad.value = false
      alertHistory.value[0].isClosed = false
      alertHistory.value[0].endAverageLoad = item.normalizedLoadAverage
      alertHistory.value[0].endTimestamp = item.timestamp
    }

    /**
     * A CPU is considered under high average load when it has *exceeded* 1 for 2 minutes or more.
     * A CPU is considered recovered from high average load when it drops *below* 1 for 2 minutes or more.
     * Therefore 1 does nothing
     *
     * @returns
     */
    function checkHeavyLoad() {
      const current = cpuHistory.value[0]

      if (current.normalizedLoadAverage > HIGH_AVERAGE_THRESHOLD) {
        return handleHeavyLoad(current)
      }

      if (current.normalizedLoadAverage < HIGH_AVERAGE_THRESHOLD) {
        return handleAverageLoad(current)
      }
    }

    return {
      cpuHistory,
      alertHistory,
      isUnderHeavyLoad,
      highLoadItem,
      recoveryItem,
      newEvent,
      bindEvents,
    }
  },
  { persist: { storage: sessionStorage } },
)

export interface CpuItem {
  normalizedLoadAverage: number
  timestamp: number
}

export interface AlertItem {
  startTimestamp: number
  startAverageLoad: number
  endTimestamp?: number
  endAverageLoad?: number
  isClosed?: boolean
}

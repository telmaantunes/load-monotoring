/* eslint-disable */
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock `socket.io-client` BEFORE importing your composable:
vi.mock('socket.io-client', () => {
  const onMock = vi.fn()
  return {
    io: vi.fn(() => ({
      on: onMock,
      connect: vi.fn(),
      disconnect: vi.fn(),
    })),
  }
})

// Only now import the composable:
import getSocket, { state } from '@/composables/socket'

describe('getSocket composable without refactor', () => {
  let mockSocket: any
  const onHandlers: Record<string, Function> = {}

  beforeEach(() => {
    // Capture the mocked socket returned during import
    mockSocket = state.socket
    // Capture event handlers registered with `.on()`
    mockSocket.on.mockImplementation((event: string | number, handler: Function) => {
      onHandlers[event] = handler
    })
    getSocket() // to re-bind handlers if needed
  })

  it('should initially have connected=false', () => {
    expect(state.connected).toBe(false)
  })

  it('should set connected=true on connect event', () => {
    onHandlers.connect()
    expect(state.connected).toBe(true)
  })

  it('should set connected=false on disconnect event', () => {
    onHandlers.disconnect()
    expect(state.connected).toBe(false)
  })

  it('should throw on connect_error, error, and reconnect_error events', () => {
    expect(() => onHandlers.connect_error(new Error('test error'))).toThrow('test error')
    expect(() => onHandlers.error(new Error('test error 2'))).toThrow('test error 2')
    expect(() => onHandlers.reconnect_error(new Error('test error 3'))).toThrow('test error 3')
  })
})

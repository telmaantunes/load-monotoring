/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from 'socket.io-client'
import { reactive } from 'vue'

export const state = reactive({
  connected: false,
  socket: io(`${import.meta.env.VITE_API}`, {
    reconnectionDelayMax: 10000,
    autoConnect: false,
  }),
})

export default function getSocket(): Socket {
  state.socket.on('connect', () => {
    state.connected = true
  })

  state.socket.on('disconnect', () => {
    state.connected = false
  })

  state.socket.on('connect_error', (error: any) => {
    throw new Error(error)
  })
  state.socket.on('error', (error: any) => {
    throw new Error(error)
  })
  state.socket.on('reconnect_error', (error: any) => {
    throw new Error(error)
  })

  return state.socket
}

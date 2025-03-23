<script setup lang="ts">
import { useCpuStore } from './stores/cpu'
import { state } from '@/composables/socket'

// remove any existing listeners (after a hot module replacement)
state.socket.off()
state.socket.connect()

const store = useCpuStore()
store.bindEvents()
</script>

<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>
</template>

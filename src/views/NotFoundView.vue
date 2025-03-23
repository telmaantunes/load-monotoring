<template>
  <div class="not-found">
    <h1 class="not-found__header">404 - Page Not Found</h1>
    <p>{{ errorMessage }}</p>
    <button class="not-found__button" @click="goBackHome">Go back home</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const errorMessage = ref('Sorry, the page you are looking for does not exist.')

const goBackHome = () => {
  window.location.href = '/'
}
</script>

<style lang="scss" scoped>
.not-found {
  display: flex;
  flex-flow: column;
  row-gap: 32px;

  &__header {
    @include title;
  }

  &__button {
    width: auto;
    margin: auto;
  }
}
</style>

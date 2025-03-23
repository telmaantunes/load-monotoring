<script setup lang="ts">
import AlertToasts from '@/components/AlertToasts.vue'
</script>

<template>
  <div class="base-layout">
    <AlertToasts />

    <header class="base-layout__header">
      <RouterLink class="base-layout__header__title" to="/"> CPU Load Monitoring </RouterLink>
    </header>

    <main class="base-layout__main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.base-layout {
  &__header {
    @include zIndex(2);

    padding: 8px 32px;
    width: 100%;
    background: $gradient;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: flex-start;

    &__title {
      @include header;
    }
  }

  &__main {
    @include layout;

    transition: all 0.3s ease;
  }
}
</style>

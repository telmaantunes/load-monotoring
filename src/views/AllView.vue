<script setup lang="ts">
import LoadList from '@/components/LoadList.vue'
</script>

<template>
  <div class="home-page">
    <LoadList class="home-page__main" :show-all="true" />

    <RouterLink to="/" class="home-page__link"> Go back </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  &__main {
    @include card;
  }

  &__link {
    @include link;

    text-align: left;
    margin-top: 24px;
    width: auto;
    display: block;
  }
}
</style>

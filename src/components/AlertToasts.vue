<script setup lang="ts">
import { useCpuStore } from '@/stores/cpu'
import { computed } from 'vue'

const store = useCpuStore()

const visibleItems = computed(() => {
  return store.alertHistory.filter((item) => !item.isClosed)
})
</script>

<template>
  <div v-if="visibleItems.length" class="alert-toasts">
    <div
      v-for="item in visibleItems"
      :key="'alert' + item.startTimestamp"
      class="alert-toasts__item"
      :class="{ 'alert-toasts__item--positive': item.endTimestamp }"
      @click="item.isClosed = true"
    >
      {{
        item.endTimestamp
          ? 'Your CPU has recovered from high average load.'
          : 'You CPU is under high average load.'
      }}
      <img class="alert-toasts__item__cross" src="@/assets/icons/cross.svg" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.alert-toasts {
  @include layout;
  @include zIndex(1);

  position: fixed;
  min-height: auto;
  padding-bottom: 0;
  height: auto;
  top: 0;
  right: 0;
  background: transparent;
  width: auto;

  &__item {
    @include card;
    @include title($white);

    background: color($negative);
    position: relative;
    cursor: pointer;
    text-align: left;
    padding: 16px 32px 16px 24px;
    width: auto;
    margin: 0;

    + .alert-toasts__item {
      margin-top: 16px;
    }

    &__cross {
      position: absolute;
      width: 16px;
      height: 16px;
      right: 8px;
      top: 8px;
    }

    &--positive {
      background: color($positive);
    }
  }
}
</style>

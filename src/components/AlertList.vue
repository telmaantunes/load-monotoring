<script setup lang="ts">
import { useCpuStore } from '@/stores/cpu'
import { computed, ref } from 'vue'
import PaginationSection from '@/components/PaginationSection.vue'
import ListItem from './ListItem.vue'

const ITEMS_PER_PAGE = 10
const page = ref<number>(1)
const store = useCpuStore()

const visibleItems = computed(() => {
  return store.alertHistory
    .slice((page.value - 1) * ITEMS_PER_PAGE, (page.value - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
    .map((item) => [
      new Date(item.startTimestamp).toLocaleString(),
      item.endTimestamp ? new Date(item.endTimestamp).toLocaleString() : '-',
    ])
})
</script>

<template>
  <div class="alert-list">
    <h2 class="alert-list__header">CPU high average load history</h2>
    <PaginationSection
      v-model="page"
      :item-count="store.alertHistory.length"
      :items-per-page="ITEMS_PER_PAGE"
      class="alert-list"
    >
      <table class="alert-list__container">
        <thead class="alert-list__title">
          <tr>
            <td>Start</td>
            <td>End</td>
          </tr>
        </thead>
        <ListItem v-for="item in visibleItems" :key="item[0]" :item="item" />
      </table>
    </PaginationSection>
  </div>
</template>

<style lang="scss" scoped>
.alert-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;

  &__header {
    @include title;

    width: 100%;
    margin-bottom: 24px;
    text-align: left;
  }

  &__container {
    width: 100%;
    text-align: left;
    display: table;
    border-collapse: collapse;
  }

  &__title {
    @include subtitle;

    margin-bottom: 16px;
    border-bottom: 2px solid $grey;
  }
}
</style>

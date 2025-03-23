<script setup lang="ts">
import ListItem from '@/components/ListItem.vue'
import { useCpuStore } from '@/stores/cpu'
import { computed, ref } from 'vue'
import PaginationSection from '@/components/PaginationSection.vue'

const ITEMS_PER_PAGE = 10
const page = ref<number>(1)
const store = useCpuStore()

const props = defineProps<{
  showAll?: boolean
}>()

const visibleItems = computed(() => {
  if (!store.cpuHistory || !store.cpuHistory?.length) {
    return []
  }

  const items = props.showAll
    ? store.cpuHistory
    : store.cpuHistory.slice(
        (page.value - 1) * ITEMS_PER_PAGE,
        (page.value - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
      )

  return items.map((item) => [
    item.normalizedLoadAverage,
    new Date(item.timestamp).toLocaleString(),
  ])
})
</script>

<template>
  <div class="load-list">
    <h2 class="load-list__header">CPU events history</h2>
    <PaginationSection
      v-model="page"
      :item-count="store.cpuHistory.length"
      :items-per-page="props.showAll ? store.cpuHistory.length : ITEMS_PER_PAGE"
      :show-all="props.showAll"
      class="load-list__table"
    >
      <table class="load-list__container">
        <thead>
          <tr class="load-list__title">
            <td>Load average</td>
            <td>Time</td>
          </tr>
        </thead>
        <ListItem v-for="item in visibleItems" :key="item[0]" :item="item" />
      </table>
      <template #actions>
        <RouterLink v-if="!props.showAll" class="load-list__button" to="/all">All</RouterLink>
      </template>
    </PaginationSection>
  </div>
</template>

<style lang="scss" scoped>
.load-list {
  width: 100%;
  display: flex;
  flex-flow: column;

  &__header {
    @include title;

    width: 100%;
    margin-bottom: 24px;
    text-align: left;
  }

  &__table {
    width: 100%;
  }

  &__container {
    width: 100%;
    text-align: left;
    display: table;
    border-collapse: collapse;
  }

  &__title {
    @include subtitle;

    border-bottom: 2px solid $grey;
  }

  &__button {
    @include body($secondary);

    margin-left: 6px;
    padding: 2px 8px;
    background-color: $background;
    border: 1px solid $secondary;
    border-radius: $border-radius-mini;
    cursor: pointer;
  }
}
</style>

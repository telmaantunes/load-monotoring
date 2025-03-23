<script setup lang="ts">
import { computed } from 'vue'
defineEmits(['changePage'])

const currentPage = defineModel<number>({ default: 1 })

const props = defineProps<{
  itemCount: number
  itemsPerPage?: number
  showAll?: boolean
}>()

const pageCount = computed(() => Math.ceil(props.itemCount / (props.itemsPerPage ?? 10)))

const pages = computed(() => Array.from({ length: pageCount.value }, (_, i) => i + 1))

function changePage(value: number) {
  currentPage.value = value
}
</script>

<template>
  <div class="pagination-section">
    <slot />
    <div v-if="!props.showAll && pageCount" class="pagination-section__actions">
      <button
        :disabled="1 === currentPage"
        :class="[
          'pagination-section__button',
          { 'pagination-section__button--disabled': 1 === currentPage },
        ]"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>

      <button
        v-for="page in pages"
        :key="page"
        :disabled="page === currentPage"
        :class="[
          'pagination-section__button',
          { 'pagination-section__button--active': page === currentPage },
        ]"
        @click="changePage(page)"
      >
        {{ page }}
      </button>

      <button
        :disabled="pageCount === currentPage"
        :class="[
          'pagination-section__button',
          { 'pagination-section__button--disabled': pageCount === currentPage },
        ]"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pagination-section {
  &__actions {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    padding-top: 24px;
    margin-bottom: 24px;
    margin-top: auto;
    gap: 8px;
  }

  &__link {
    @include link;

    text-align: left;
    margin: 24px 0;
  }

  &__button {
    @include body($secondary);

    background-color: $background;
    border: 1px solid $secondary;
    border-radius: $border-radius-mini;
    cursor: pointer;

    &--active {
      @include accent;
    }

    &--disabled {
      background-color: $grey;
      border: 1px solid $grey;
      color: $dark-grey;
      cursor: not-allowed;
    }
  }
}
</style>

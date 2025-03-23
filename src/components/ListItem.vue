<script setup lang="ts">
const props = defineProps<{
  item: Array<number | string>
}>()
</script>

<template>
  <tr class="list-item">
    <td v-for="element in props.item" :key="'list-item-' + element" class="list-item__label">
      {{ element }}
    </td>
  </tr>
</template>

<style lang="scss" scoped>
.list-item {
  border-top: 1px solid $grey;

  &__label {
    @include body;

    padding: 8px 0;
  }
}
</style>

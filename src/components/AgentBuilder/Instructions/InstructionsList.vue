<template>
  <section
    :class="[
      'instructions-list',
      {
        'instructions-list--loading': isLoading,
      },
    ]"
    data-testid="instructions"
  >
    <template v-if="isLoading">
      <UnnnicSkeletonLoading
        v-for="index in 10"
        :key="index"
        tag="div"
        width="100%"
        height="60px"
        data-testid="instruction-loading"
      />
    </template>
    <template v-else>
      <Instruction
        v-for="instruction in instructions"
        :key="instruction.id"
        :instruction="instruction"
        :showActions="showActions"
        data-testid="instruction-added"
      />
    </template>
  </section>
</template>

<script setup>
import Instruction from './Instruction.vue';

defineProps({
  instructions: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  showActions: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.instructions-list {
  display: flex;
  flex-direction: column;

  border-radius: $unnnic-border-radius-md;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

  &--loading {
    gap: $unnnic-spacing-nano;

    border: none;
    border-radius: 0;
  }
}
</style>

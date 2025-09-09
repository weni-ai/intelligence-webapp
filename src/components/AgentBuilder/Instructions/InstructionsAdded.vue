<template>
  <section class="instructions-added">
    <h2
      class="instructions-added__title"
      data-testid="instructions-title"
    >
      {{ $t('agent_builder.instructions.instructions_added.title') }}
    </h2>

    <section
      :class="[
        'instructions-added__instructions',
        {
          'instructions-added__instructions--loading':
            instructionsStore.instructions.status === 'loading',
        },
      ]"
      data-testid="instructions"
    >
      <template v-if="instructionsStore.instructions.status === 'loading'">
        <UnnnicSkeletonLoading
          v-for="index in 10"
          :key="index"
          tag="div"
          width="100%"
          height="60px"
          data-testid="instruction-loading"
        />
      </template>
      <template v-else></template>
    </section>
  </section>
</template>

<script setup>
import { useInstructionsStore } from '@/store/Instructions';

const instructionsStore = useInstructionsStore();
instructionsStore.instructions.status = 'loading';
</script>

<style lang="scss" scoped>
.instructions-added {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  &__title {
    margin: 0;

    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-lg;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__instructions {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-nano;

    border-radius: $unnnic-border-radius-md;
    border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

    &--loading {
      border: none;
      border-radius: 0;
    }
  }
}
</style>

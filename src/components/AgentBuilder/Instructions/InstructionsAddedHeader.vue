<template>
  <header class="instructions-added-header">
    <hgroup>
      <h2
        class="instructions-added-header__title"
        data-testid="instructions-title"
      >
        {{ $t('agent_builder.instructions.instructions_added.title') }}
      </h2>
      <h3
        class="instructions-added-header__subtitle"
        data-testid="instructions-subtitle"
      >
        {{
          $t('agent_builder.instructions.instructions_added.subtitle', {
            count: instructionsCount,
          })
        }}
      </h3>
    </hgroup>
  </header>
</template>

<script setup>
defineProps({
  instructionsCount: {
    type: Number,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.instructions-added-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__title {
    margin: 0;

    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-lg;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__subtitle {
    margin: 0;

    color: $unnnic-color-neutral-cloudy;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-md;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }
}
</style>

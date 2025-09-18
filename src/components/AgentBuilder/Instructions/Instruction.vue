<template>
  <section class="instruction">
    <p
      class="instruction__text"
      data-testid="instruction-text"
    >
      {{ text }}
    </p>

    <p
      v-if="tag"
      class="instruction__tag"
      data-testid="instruction-tag"
    >
      {{ tag }}
    </p>
  </section>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    default: '',
    required: false,
  },
});
</script>

<style lang="scss" scoped>
.instruction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $unnnic-spacing-sm;

  padding: $unnnic-spacing-sm;

  &:not(:last-child) {
    border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  }

  &__text {
    margin: 0;
    color: $unnnic-color-neutral-cloudy;

    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__tag {
    border-radius: $unnnic-border-radius-pill;

    padding: $unnnic-spacing-nano $unnnic-spacing-ant;

    background-color: $unnnic-color-neutral-light;
    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-md;
    font-weight: $unnnic-font-weight-regular;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
  }
}
</style>

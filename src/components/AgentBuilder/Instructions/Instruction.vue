<template>
  <section class="instruction">
    <p
      class="instruction__text"
      data-testid="instruction-text"
    >
      {{ text }}
    </p>
  </section>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true,
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
}
</style>

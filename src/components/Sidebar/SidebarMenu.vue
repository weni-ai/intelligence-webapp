<template>
  <div class="unnnic-side-bar-menu">
    <p class="unnnic-side-bar-menu__title">{{ text }}</p>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss">
.unnnic-side-bar-menu {
  color: $unnnic-color-neutral-cloudy;
  font-family: $unnnic-font-family-secondary;
  font-weight: $unnnic-font-weight-regular;

  &__title {
    font-size: $unnnic-font-size-body-md;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
  }
}
</style>

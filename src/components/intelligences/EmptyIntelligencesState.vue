<template>
  <section class="intelligences-list--empty">
    <img
      src="../../assets/imgs/doris-doubt-reaction.png"
      alt="Doris Doubt Reaction"
    />

    <p class="intelligences-list__title">
      {{ $t('intelligences.no_intelligence_added') }}
    </p>
  </section>
</template>

<style lang="scss" scoped>
.intelligences-list--empty {
  padding-top: $unnnic-spacing-sm;
  display: flex;
  flex-direction: column;
  align-items: center;

  .create-ia-button {
    min-width: 15.625 * $unnnic-font-size;
  }
}

.intelligences-list__title {
  font-family: $unnnic-font-family-secondary;
  font-size: $unnnic-font-size-title-sm;
  line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
  font-weight: $unnnic-font-weight-bold;
  color: $unnnic-color-neutral-darkest;
  text-align: center;
  margin-block: $unnnic-spacing-md;
}
</style>

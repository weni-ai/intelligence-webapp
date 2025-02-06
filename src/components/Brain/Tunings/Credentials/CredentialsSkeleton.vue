<template>
  <section
    class="credentials-skeleton"
    data-testid="credentials-skeleton"
  >
    <section
      v-for="index in 3"
      :key="index"
      class="credentials-skeleton__item"
    >
      <UnnnicSkeletonLoading
        tag="div"
        :width="`${Math.floor(Math.random() * 12) + 8}%`"
        height="21px"
        data-testid="skeleton-loading"
      />

      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="45px"
        data-testid="skeleton-loading"
      />
    </section>

    <UnnnicSkeletonLoading
      tag="div"
      width="100%"
      height="45px"
      data-testid="skeleton-loading"
    />
  </section>
</template>

<style lang="scss" scoped>
.credentials-skeleton {
  display: grid;
  gap: $unnnic-spacing-sm;

  &__item {
    display: grid;
    gap: $unnnic-spacing-nano;
  }
}
</style>

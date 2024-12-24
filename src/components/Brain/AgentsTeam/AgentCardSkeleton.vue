<template>
  <section class="agent-card-skeleton">
    <UnnnicSkeletonLoading
      tag="div"
      width="30%"
      height="22px"
    />

    <UnnnicSkeletonLoading
      tag="div"
      width="100%"
      height="44px"
    />

    <section class="agent-card-skeleton__skills">
      <UnnnicSkeletonLoading
        tag="div"
        width="100px"
        height="30px"
      />
      <UnnnicSkeletonLoading
        tag="div"
        width="150px"
        height="30px"
      />
    </section>

    <UnnnicSkeletonLoading
      tag="div"
      width="100%"
      height="38px"
    />
  </section>
</template>

<style lang="scss" scoped>
.agent-card-skeleton {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-xs;

  &__skills {
    width: 100%;
    display: flex;
    gap: $unnnic-spacing-nano;
    flex-wrap: wrap;
  }
}
</style>

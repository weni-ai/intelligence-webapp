<template>
  <section
    class="sidebar-header"
    data-testid="sidebar-header"
  >
    <h1
      class="sidebar-header__title"
      data-testid="sidebar-header-title"
    >
      <!-- TODO: Be this hardcoded name dynamic based on the agent name -->
      Agent Name
    </h1>
    <p
      class="sidebar-header__description"
      data-testid="sidebar-header-description"
    >
      {{ $t('profile.edit_manager_profile') }}
    </p>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
.sidebar-header {
  border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  padding-bottom: $unnnic-spacing-sm;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    cursor: pointer;
    background-color: $unnnic-color-bg-soft;
  }

  &__title {
    margin: 0;

    color: $unnnic-color-neutral-darkest;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-gt;
    font-weight: $unnnic-font-weight-bold;
    line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
  }

  &__description {
    color: $unnnic-color-neutral-clean;
    font-family: $unnnic-font-family-secondary;
    font-size: $unnnic-font-size-body-md;
    line-height: $unnnic-font-size-body-md + $unnnic-line-height-md;
  }
}
</style>

<template>
  <section
    :class="['sidebar-header', { 'sidebar-header--loading': isLoading }]"
    data-testid="sidebar-header"
  >
    <template v-if="isLoading">
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="19px"
        data-testid="sidebar-header-skeleton"
      />
      <UnnnicSkeletonLoading
        tag="div"
        width="100%"
        height="17px"
        data-testid="sidebar-header-skeleton"
      />
    </template>
    <template v-else>
      <h1
        class="sidebar-header__title"
        data-testid="sidebar-header-title"
      >
        {{ profileStore.name.old }}
      </h1>
      <p
        class="sidebar-header__description"
        data-testid="sidebar-header-description"
      >
        {{ $t('profile.edit_manager_profile') }}
      </p>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useProfileStore } from '@/store/Profile';

const profileStore = useProfileStore();
const isLoading = computed(() => profileStore.status === 'loading');
</script>

<style lang="scss" scoped>
.sidebar-header {
  border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  padding-bottom: $unnnic-spacing-sm;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover:not(&--loading) {
    cursor: pointer;
    background-color: $unnnic-color-bg-soft;
  }

  &--loading {
    gap: $unnnic-spacing-nano;
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

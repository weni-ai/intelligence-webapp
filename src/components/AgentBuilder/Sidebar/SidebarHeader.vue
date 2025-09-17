<template>
  <section
    class="sidebar-header"
    data-testid="sidebar-header"
    @click="isOpenEditManagerProfileDrawer = true"
  >
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
  </section>

  <EditManagerProfileDrawer
    v-model="isOpenEditManagerProfileDrawer"
    data-testid="edit-manager-profile-drawer"
  />
</template>

<script setup>
import { ref } from 'vue';

import { useProfileStore } from '@/store/Profile';

import EditManagerProfileDrawer from './EditManagerProfileDrawer.vue';

const profileStore = useProfileStore();

const isOpenEditManagerProfileDrawer = ref(false);
</script>

<style lang="scss" scoped>
.sidebar-header {
  border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  padding: $unnnic-spacing-sm;

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

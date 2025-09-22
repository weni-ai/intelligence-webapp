<template>
  <section class="supervisor-filters">
    <FilterText data-testid="filter-text" />

    <UnnnicButton
      iconLeft="filter_list"
      type="secondary"
      :text="$t('agent_builder.supervisor.filters.filter_conversations')"
      data-testid="filter-button"
      @click="openFilterDrawer"
    />

    <UnnnicDrawer
      :modelValue="isFilterDrawerOpen"
      class="supervisor-filters__drawer"
      :title="
        $t('agent_builder.supervisor.filters.filter_conversations_drawer')
      "
      :primaryButtonText="$t('agent_builder.supervisor.filters.apply_filters')"
      :secondaryButtonText="
        $t('agent_builder.supervisor.filters.clear_filters')
      "
      @close="closeFilterDrawerWithReset"
      @primary-button-click="applyFilters"
      @secondary-button-click="closeFilterDrawerWithReset"
    >
      <template #content>
        <FilterDate />
        <FilterStatus />
        <FilterCsat />
        <FilterTopics />
      </template>
    </UnnnicDrawer>
  </section>
</template>

<script setup>
import { ref } from 'vue';

import FilterText from './FilterText.vue';
import FilterDate from './FilterDate.vue';
import FilterStatus from './FilterStatus.vue';
import FilterCsat from './FilterCsat.vue';
import FilterTopics from './FilterTopics.vue';

const isFilterDrawerOpen = ref(false);

function openFilterDrawer() {
  isFilterDrawerOpen.value = true;
}

function closeFilterDrawerWithReset() {
  isFilterDrawerOpen.value = false;
}

function applyFilters() {
  isFilterDrawerOpen.value = false;
}
</script>

<style scoped lang="scss">
.supervisor-filters {
  display: grid;
  grid-template-columns: 8fr 4fr;
  gap: $unnnic-spacing-sm;

  &__drawer {
    :deep(.unnnic-drawer__container .unnnic-drawer__content) {
      overflow: visible;

      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-sm;
    }
  }
}
</style>

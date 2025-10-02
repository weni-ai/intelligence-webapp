<template>
  <header
    :class="[
      'header',
      { 'header--tunings': currentBrainRoute?.page.includes('tunings') },
    ]"
  >
    <section class="header__infos">
      <section class="infos__title">
        <p class="title__text">
          {{ currentBrainRoute?.title }}
        </p>
      </section>
      <UnnnicIntelligenceText
        v-if="currentBrainRoute.description"
        tag="p"
        family="secondary"
        size="body-gt"
      >
        {{ currentBrainRoute.description }}
      </UnnnicIntelligenceText>
    </section>
    <UnnnicButton
      v-if="currentBrainRoute?.page.includes('profile')"
      :disabled="profile.isSaveButtonDisabled"
      :loading="profile.isSaving"
      @click="profile.save"
    >
      {{ $t('router.tunings.save_changes') }}
    </UnnnicButton>
    <TuningsHeaderActions
      v-else-if="currentBrainRoute?.page.includes('tunings')"
    />
    <section
      v-else-if="showDateFilter"
      class="monitoring-filters"
    >
      <UnnnicInputDatePicker
        v-model="dateFilter"
        class="filter-date"
        size="sm"
        position="right"
      />
      <MonitoringViewFilter />
    </section>
  </header>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format, subDays } from 'date-fns';

import useBrainRoutes from '@/composables/useBrainRoutes';

import { useProfileStore } from '@/store/Profile';

import MonitoringViewFilter from './Monitoring/ViewFilter.vue';
import TuningsHeaderActions from '../TuningsHeaderActions.vue';

const brainRoutes = useBrainRoutes();
const dateFilter = ref({
  start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
  end: format(new Date(), 'yyyy-MM-dd'),
});

const route = useRoute();
const router = useRouter();

const profile = useProfileStore();

const currentBrainRoute = computed(() => {
  return (
    brainRoutes.value.find((e) => e.page === route.name) || brainRoutes.value[0]
  );
});

const showDateFilter = computed(() => route.name?.includes('monitoring'));

function updateQueriesAtFilterDate() {
  if (!showDateFilter.value) return;

  const { start, end } = dateFilter.value;
  router.replace({
    ...route,
    query: { started_day: start, ended_day: end },
  });
}

watch(
  () => dateFilter.value,
  () => {
    updateQueriesAtFilterDate();
  },
);

watch(
  currentBrainRoute,
  (currentBrainRoute) => {
    updateQueriesAtFilterDate();
  },
  {
    immediate: true,
  },
);
</script>

<style lang="scss" scoped>
.header {
  display: grid;
  grid-template-columns: 9fr 3fr;
  gap: $unnnic-spacing-sm;
  align-items: center;
  justify-content: space-between;

  margin-bottom: $unnnic-spacing-md;

  & > *:only-child {
    grid-column: span 2;
  }

  &--tunings {
    grid-template-columns: 6fr 6fr;
  }

  &__infos {
    display: grid;
    gap: $unnnic-spacing-xs;

    .infos__title {
      display: flex;
      gap: $unnnic-spacing-ant;
      align-items: center;

      .title__text {
        color: $unnnic-color-neutral-darkest;
        font-family: $unnnic-font-family-secondary;
        font-size: $unnnic-font-size-title-sm;
        line-height: $unnnic-font-size-title-sm + $unnnic-line-height-md;
        font-weight: $unnnic-font-weight-bold;
      }
    }
  }
}

.monitoring-filters {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: $unnnic-spacing-xs;

  .filter-date {
    :deep(.unnnic-form) {
      width: 100%;
      .unnnic-form-input {
        width: 100%;
      }
    }
  }
}
</style>

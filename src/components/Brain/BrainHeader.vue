<template>
  <header class="header">
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
    <UnnnicButton
      v-else-if="currentBrainRoute?.page.includes('tunings')"
      :disabled="isTuningsSaveButtonDisabled"
      :loading="isTuningsSaveButtonLoading"
      @click="saveTunings"
    >
      {{ $t('router.tunings.save_changes') }}
    </UnnnicButton>
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
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { format, subDays } from 'date-fns';

import useBrainRoutes from '@/composables/useBrainRoutes';

import { useProfileStore } from '@/store/Profile';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useTuningsStore } from '@/store/Tunings';
import { usePreviewStore } from '@/store/Preview';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

import MonitoringViewFilter from './Monitoring/ViewFilter.vue';
const brainRoutes = useBrainRoutes();
const dateFilter = ref({
  start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
  end: format(new Date(), 'yyyy-MM-dd'),
});

const route = useRoute();
const router = useRouter();

const profile = useProfileStore();
const isPreviewOpen = ref(false);

const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;

const currentBrainRoute = computed(() => {
  return (
    brainRoutes.value.find((e) => e.page === route.name) || brainRoutes.value[0]
  );
});

const showDateFilter = computed(() => route.name?.includes('monitoring'));

const tuningsStore = useTuningsStore();
const previewStore = usePreviewStore();
const store = useStore();

const isTuningsSaveButtonDisabled = computed(() => {
  return isAgentsTeamEnabled
    ? !tuningsStore.isCredentialsValid && !tuningsStore.hasSettingsChanges
    : store.getters.isBrainSaveButtonDisabled;
});

const isTuningsSaveButtonLoading = computed(() => {
  return isAgentsTeamEnabled
    ? tuningsStore.isLoadingTunings
    : store.state.Brain.isSavingChanges;
});

async function saveTunings() {
  if (isAgentsTeamEnabled) {
    tuningsStore.saveTunings();
  } else {
    store.dispatch('saveBrainChanges');
  }
}

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

const handlePreview = () => {
  isPreviewOpen.value = true;
};

const handleAgentsGallery = () => {
  useAgentsTeamStore().isAgentsGalleryOpen = true;
};
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

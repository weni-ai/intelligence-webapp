<template>
  <section class="tunings-header-actions">
    <UnnnicButton type="secondary">
      {{ $t('agent_builder.tunings.project_details') }}
    </UnnnicButton>
    <UnnnicButton
      :disabled="isTuningsSaveButtonDisabled"
      :loading="isTuningsSaveButtonLoading"
      @click="saveTunings"
    >
      {{ $t('router.tunings.save_changes') }}
    </UnnnicButton>
  </section>
</template>

<script setup>
import { useStore } from 'vuex';

import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useTuningsStore } from '@/store/Tunings';
import { computed } from 'vue';

const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;
const tuningsStore = useTuningsStore();
const store = useStore();

const isTuningsSaveButtonDisabled = computed(() => {
  return isAgentsTeamEnabled
    ? !tuningsStore.isCredentialsValid && !tuningsStore.isSettingsValid
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
</script>

<style lang="scss" scoped>
.tunings-header-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $unnnic-spacing-xs;
}
</style>

<template>
  <section class="tunings-header-actions">
    <UnnnicButton
      type="secondary"
      @click="showModalProjectDetails = true"
    >
      {{ $t('agent_builder.tunings.project_details') }}
    </UnnnicButton>
    <UnnnicButton
      :disabled="isTuningsSaveButtonDisabled"
      :loading="isTuningsSaveButtonLoading"
      @click="saveTunings"
    >
      {{ $t('router.tunings.save_changes') }}
    </UnnnicButton>

    <UnnnicModalDialog
      class="tunings-header-actions__modal-project-details"
      data-testid="tunings-header-actions__modal-project-details"
      :modelValue="showModalProjectDetails"
      showCloseIcon
      size="md"
      :title="$t('agent_builder.tunings.project_details')"
      @update:model-value="showModalProjectDetails = false"
    >
    </UnnnicModalDialog>
  </section>
</template>

<script setup>
import { useStore } from 'vuex';

import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useTuningsStore } from '@/store/Tunings';
import { computed, ref } from 'vue';

const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;
const tuningsStore = useTuningsStore();
const store = useStore();

const showModalProjectDetails = ref(false);

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

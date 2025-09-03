<template>
  <section
    :class="[
      'tunings-header-actions',
      {
        'tunings-header-actions--with-project-details':
          showProjectDetailsButton,
      },
    ]"
  >
    <UnnnicButton
      v-if="showProjectDetailsButton"
      type="secondary"
      :loading="projectStore.projectDetails.status === 'loading'"
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

    <ModalUpgradeToMultiagents
      v-if="showUpgradeToMultiagentsModal"
      :modelValue="showUpgradeToMultiagentsModal"
      @update:model-value="showUpgradeToMultiagentsModal = $event"
    />

    <ProjectDetailsModal
      v-else
      :modelValue="showModalProjectDetails"
      @update:model-value="showModalProjectDetails = $event"
      @upgrade-to-multiagents="showUpgradeToMultiagentsModal = true"
    />
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useStore } from 'vuex';

import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useTuningsStore } from '@/store/Tunings';
import { useProjectStore } from '@/store/Project';
import { useUserStore } from '@/store/User';

import ModalUpgradeToMultiagents from './Brain/Tunings/ModalUpgradeToMultiagents.vue';
import ProjectDetailsModal from './ProjectDetailsModal/index.vue';

const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;
const tuningsStore = useTuningsStore();
const projectStore = useProjectStore();
const store = useStore();

const showModalProjectDetails = ref(false);
const showUpgradeToMultiagentsModal = ref(false);

const showProjectDetailsButton = computed(() => {
  const email = useUserStore().user?.email;
  if (!email) return false;

  return email.includes('@weni.ai') || email.includes('@vtex.com');
});

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

onMounted(async () => {
  await projectStore.getProjectDetails();
});
</script>

<style lang="scss" scoped>
.tunings-header-actions {
  display: grid;
  gap: $unnnic-spacing-xs;

  &--with-project-details {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

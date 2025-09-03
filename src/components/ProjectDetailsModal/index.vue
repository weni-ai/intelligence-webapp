<template>
  <UnnnicModalDialog
    class="project-details-modal"
    data-testid="project-details-modal"
    :modelValue="modelValue"
    showCloseIcon
    size="md"
    :title="$t('agent_builder.tunings.project_details')"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <ProjectInfo
      :title="
        $t('agent_builder.tunings.agent_backend', isAgentsTeamEnabled ? 2 : 1)
      "
      :description="projectDetails.backend"
    />

    <template v-if="isAgentsTeamEnabled">
      <UnnnicDivider ySpacing="sm" />
    </template>
    <SettingsUpgradeToMultiagents
      v-else
      @upgrade-to-multiagents="emit('upgrade-to-multiagents', true)"
    />
  </UnnnicModalDialog>
</template>

<script setup>
import { computed } from 'vue';

import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useProjectStore } from '@/store/Project';
import SettingsUpgradeToMultiagents from '../Brain/Tunings/SettingsUpgradeToMultiagents.vue';
import ProjectInfo from './ProjectInfo.vue';

const emit = defineEmits(['update:modelValue', 'upgrade-to-multiagents']);
defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});
const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;
const projectStore = useProjectStore();

const projectDetails = computed(() => projectStore.projectDetails);
</script>

<style lang="scss" scoped>
.project-details-modal {
  .modal-project-details__content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-sm;
  }
}
</style>

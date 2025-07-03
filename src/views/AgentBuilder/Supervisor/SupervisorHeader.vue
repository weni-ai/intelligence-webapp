<template>
  <AgentBuilderHeader :withDivider="false">
    <template #actions>
      <section class="supervisor-header__actions">
        <UnnnicButton
          v-if="showExport"
          iconCenter="open_in_new"
          type="secondary"
          data-testid="export-button"
          @click="openExportModal"
        />
      </section>

      <SupervisorExportModal
        v-if="showExport"
        v-model="isExportModalOpen"
        data-testid="export-modal"
      />
    </template>
  </AgentBuilderHeader>
</template>

<script setup>
import AgentBuilderHeader from '@/components/AgentBuilder/Header.vue';
import SupervisorExportModal from '@/components/AgentBuilder/Supervisor/SupervisorExportModal.vue';

import { useFeatureFlagsStore } from '@/store/FeatureFlags';

import { computed, ref } from 'vue';

const featureFlagsStore = useFeatureFlagsStore();

const showExport = computed(() => featureFlagsStore.flags.supervisorExport);

const isExportModalOpen = ref(false);

function openExportModal() {
  isExportModalOpen.value = true;
}
</script>

<style lang="scss" scoped>
.supervisor-header {
  &__actions {
    display: flex;
    align-items: center;
    gap: $unnnic-spacing-xs;
    justify-content: flex-end;
  }
}
</style>

<template>
  <section class="agents-team">
    <AgentBuilderHeader
      title="Agents Team"
      subtitle="Assign agents to your team"
      withDivider
      actionsSize="lg"
    >
      <template #actions>
        <section class="agents-team__actions">
          <UnnnicButton
            type="secondary"
            iconLeft="add"
            @click="handleAgentsGallery"
          >
            {{ $t('router.agents_team.assign_agents') }}
          </UnnnicButton>

          <UnnnicButton
            type="primary"
            iconLeft="play_arrow"
            iconsFilled
            @click="handlePreview"
          >
            {{ $t('router.agents_team.preview') }}
          </UnnnicButton>
        </section>
      </template>
    </AgentBuilderHeader>

    <ActiveTeam />

    <AgentsGalleryModal />

    <PreviewDrawer v-model="isPreviewOpen" />
  </section>
</template>

<script setup>
import { ref } from 'vue';

import AgentBuilderHeader from '@/components/AgentBuilder/Header.vue';
import PreviewDrawer from '@/components/Brain/Preview/PreviewDrawer.vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import ActiveTeam from './ActiveTeam.vue';
import AgentsGalleryModal from './AgentsGalleryModal.vue';

const isPreviewOpen = ref(false);

const handleAgentsGallery = () => {
  useAgentsTeamStore().isAgentsGalleryOpen = true;
};

const handlePreview = () => {
  isPreviewOpen.value = true;
};
</script>

<style lang="scss" scoped>
section.agents-team {
  display: grid;
  grid-template-rows: auto 1fr;

  .agents-team__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $unnnic-spacing-sm;
  }
}
</style>

<template>
  <section class="agent-builder">
    <BrainSideBar
      class="agent-builder__sidebar"
      data-testid="agent-builder-sidebar"
    />

    <main
      class="agent-builder__content"
      data-testid="agent-builder-content"
    >
      <component
        :is="currentView"
        data-testid="agent-builder-content-view"
      />
    </main>

    <ModalSaveChangesError
      v-if="store.state.Brain.tabsWithError"
      data-testid="agent-builder-modal-save-changes-error"
      @close="store.state.Brain.tabsWithError = null"
    />
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';

import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

import { useTuningsStore } from '@/store/Tunings';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

import Supervisor from './Supervisor/index.vue';
import AgentsTeam from './AgentsTeam/index.vue';
import Knowledge from './Knowledge.vue';
import Profile from '@/views/AgentBuilder/Profile.vue';
import Tunings from '@/views/AgentBuilder/Tunings.vue';
import BrainSideBar from '@/components/Brain/BrainSideBar.vue';
import ModalSaveChangesError from '../Brain/ModalSaveChangesError.vue';

const route = useRoute();
const store = useStore();

const agentsTeamStore = useAgentsTeamStore();

const currentView = computed(() => {
  const views = {
    knowledge: Knowledge,
    supervisor: Supervisor,
    agents: AgentsTeam,
    profile: Profile,
    tunings: Tunings,
  };

  return views[route.name];
});

onMounted(() => {
  useTuningsStore().fetchCredentials();
  agentsTeamStore.loadActiveTeam();
  agentsTeamStore.loadOfficialAgents();
  agentsTeamStore.loadMyAgents();
});
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.agent-builder {
  overflow: hidden;

  display: grid;
  grid-template-columns: auto 1fr;

  height: 100vh;
  width: 100vw;

  .agent-builder__sidebar {
    border-right: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;
  }

  .agent-builder__content {
    padding: $unnnic-spacing-sm;

    overflow-y: auto;

    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
  }
}
</style>

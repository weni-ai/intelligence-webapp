<template>
  <section class="agent-builder">
    <BrainSideBar class="agent-builder__sidebar" />

    <main class="agent-builder__content">
      <component :is="currentView" />
    </main>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';

import { useRoute } from 'vue-router';

import { useTuningsStore } from '@/store/Tunings';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

import Supervisor from './Supervisor/index.vue';
import AgentsTeam from './AgentsTeam/index.vue';
import Knowledge from './Knowledge.vue';
import Profile from '@/views/AgentBuilder/Profile.vue';
import BrainSideBar from '@/components/Brain/BrainSideBar.vue';

const route = useRoute();

const currentView = computed(() => {
  const views = {
    content: Knowledge,
    monitoring: Supervisor,
    'agents-team': AgentsTeam,
    profile: Profile,
    // 'router-tunings': RouterTunings,
  };

  return views[route.name];
});

onMounted(() => {
  useTuningsStore().fetchCredentials();
  // loadRouterOptions();
  useAgentsTeamStore().loadActiveTeam();
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

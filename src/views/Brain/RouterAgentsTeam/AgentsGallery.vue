<template>
  <section class="agents-gallery">
    <UnnnicIntelligenceText
      tag="h2"
      family="secondary"
      size="body-lg"
      color="neutral-darkest"
      weight="bold"
    >
      {{ $t('router.agents_team.gallery.title') }}
    </UnnnicIntelligenceText>

    <UnnnicInput
      iconLeft="search"
      :placeholder="$t('router.agents_team.gallery.search_placeholder')"
    />

    <section class="agents-gallery__cards">
      <template v-if="officialAgents.status === 'loading'">
        <AgentCard
          v-for="(_, index) in Array(3)"
          :key="index"
          :loading="true"
          :title="index"
          :description="index"
          :skills="[]"
        />
      </template>

      <template v-else>
        <AgentCard
          v-for="agent in officialAgents.data"
          :key="agent.name"
          :title="agent.name"
          :description="agent.description"
          :skills="agent.skills"
        />
      </template>
    </section>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AgentCard from '@/components/Brain/AgentsTeam/AgentCard.vue';

const agentsTeamStore = useAgentsTeamStore();
const officialAgents = agentsTeamStore.officialAgents;

function loadOfficialAgents() {
  agentsTeamStore.loadOfficialAgents();
}

onMounted(() => {
  loadOfficialAgents();
});
</script>

<style lang="scss" scoped>
.agents-gallery {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $unnnic-spacing-sm;
  }
}
</style>

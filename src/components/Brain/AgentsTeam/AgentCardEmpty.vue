<template>
  <button
    class="agent-card-empty"
    data-testid="agent-card-empty"
    @click="createNewAgent"
  >
    <UnnnicIcon
      icon="add"
      size="md"
      scheme="neutral-clean"
      data-testid="agent-card-empty-icon"
    />

    <UnnnicIntelligenceText
      tag="p"
      family="secondary"
      size="body-gt"
      color="neutral-dark"
      data-testid="agent-card-empty-title"
    >
      {{ $t('router.agents_team.create_agent') }}
    </UnnnicIntelligenceText>
  </button>
</template>

<script setup>
import { useAgentsTeamStore } from '@/store/AgentsTeam';

const agentsTeamStore = useAgentsTeamStore();
function createNewAgent() {
  window.open(agentsTeamStore.linkToCreateAgent, '_blank');
}
</script>

<style lang="scss" scoped>
.agent-card-empty {
  border: none;
  background: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 100%;
  width: 100%;

  cursor: pointer;
}
</style>

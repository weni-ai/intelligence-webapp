<template>
  <section
    ref="visualFlowRef"
    class="visual-flow"
  >
    <AgentCard
      ref="managerRef"
      name="Manager"
      :active="true"
      :currentTask="$t('router.preview.manager_task')"
      type="manager"
    />

    <BranchLines
      class="visual-flow__line"
      :positions="branchPositions"
      width="25"
      :height="visualFlowRef?.$el.getBoundingClientRect().height"
      :startY="managerRef?.$el.getBoundingClientRect().height"
      :coloredLineIndex="
        teamAgents?.findIndex(
          (agent) => agent.external_id === activeAgent?.external_id,
        )
      "
    />

    <section class="visual-flow__team">
      <AgentCard
        v-for="(agent, index) in teamAgents"
        :key="agent.id"
        :ref="(el) => (agentRefs[index] = el)"
        :name="agent.name"
        :active="agent.external_id === activeAgent?.external_id"
        :currentTask="agent.description"
        type="agent"
      />
    </section>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AgentCard from './AgentCard.vue';
import { usePreviewStore } from '@/store/Preview';
import BranchLines from './BranchLines.vue';

const agentsTeamStore = useAgentsTeamStore();
const previewStore = usePreviewStore();

const teamAgents = computed(() => agentsTeamStore.activeTeam.data?.agents);
const activeAgent = computed(() => previewStore.activeAgent);

const managerRef = ref(null);
const agentRefs = ref([]);

const branchPositions = computed(() => {
  if (!managerRef.value || agentRefs.value.length === 0) return [];

  const positions = [];
  const managerEl = managerRef.value.$el;
  const managerRect = managerEl.getBoundingClientRect();

  agentRefs.value.forEach((agentRef, index) => {
    if (!agentRef) return;

    const agentEl = agentRef.$el;
    const agentRect = agentEl.getBoundingClientRect();

    const startY = 0;
    const endY = agentRect.top - managerRect.bottom + agentRect.height / 2;

    positions.push({ startY, endY, isLeft: index % 2 === 0 });
  });

  return positions;
});
</script>

<style lang="scss" scoped>
.visual-flow {
  display: flex;
  flex-direction: column;
  position: relative;

  gap: $unnnic-spacing-md;

  &__team {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 0.5fr));
    gap: $unnnic-spacing-md;
    width: 100%;
  }
}
</style>

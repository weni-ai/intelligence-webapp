<template>
  <section class="visual-flow">
    <AgentCard
      v-if="managerAgent"
      :name="managerAgent.name"
      :active="managerAgent.active"
      :currentTask="managerAgent.currentTask"
      type="manager"
    />

    <!-- <span class="visual-flow__line" /> -->

    <section class="visual-flow__team">
      <AgentCard
        v-for="agent in teamAgents"
        :key="agent.id"
        :name="agent.name"
        :active="agent.active"
        :currentTask="agent.currentTask"
        type="agent"
      />
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { usePreviewStore } from '@/store/Preview';
import AgentCard from './AgentCard.vue';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

const previewStore = usePreviewStore();
const agentsTeamStore = useAgentsTeamStore();

const managerAgent = computed(() => previewStore.managerAgent);
const teamAgents = computed(() => agentsTeamStore.activeTeam.data?.agents);
</script>

<style lang="scss" scoped>
.visual-flow {
  display: flex;
  flex-direction: column;
  position: relative;

  gap: $unnnic-spacing-md;

  // &__line {
  //   position: absolute;
  //   width: calc(50% - 2px);
  //   height: 25%;
  //   background-color: $unnnic-color-neutral-white;
  //   border-radius: 6px;
  //   top: 25%;

  //   &::after {
  //     border-radius: 8px;
  //     content: '';
  //     background-image: linear-gradient(to bottom, #086766, #4dfbea);
  //     padding: 2px;
  //     width: 100%;
  //     height: 100%;
  //     position: absolute;
  //     z-index: -1;
  //   }
  // }

  &__team {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 0.5fr));
    gap: $unnnic-spacing-md;
    width: 100%;
  }
}
</style>

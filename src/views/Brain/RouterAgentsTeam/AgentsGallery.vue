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

    <UnnnicTab
      class="agents-gallery__tabs"
      :tabs="contentTabs.map((tab) => tab.page)"
      :activeTab="activeTab"
      @change="onTabChange"
    >
      <template
        v-for="tab in contentTabs"
        :key="tab.page"
        #[`tab-head-${tab.page}`]
      >
        {{ $t(`router.agents_team.gallery.${tab.title}`) }}
      </template>
    </UnnnicTab>

    <UnnnicInput
      iconLeft="search"
      :placeholder="$t('router.agents_team.gallery.search_placeholder')"
    />

    <section class="agents-gallery__cards">
      <template v-if="isLoadingAgents">
        <AgentCard
          v-for="(_, index) in Array(3)"
          :key="index"
          loading
        />
      </template>

      <template v-else>
        <AgentCard
          v-for="agent in agentsData"
          :key="agent.uuid"
          :title="agent.name"
          :description="agent.description"
          :skills="agent.skills"
          :uuid="agent.uuid"
          :assigned="agent.assigned"
        />
      </template>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AgentCard from '@/components/Brain/AgentsTeam/AgentCard.vue';

const agentsTeamStore = useAgentsTeamStore();
const officialAgents = agentsTeamStore.officialAgents;
const myAgents = agentsTeamStore.myAgents;

const contentTabs = ref([
  { title: 'official', page: 'official' },
  { title: 'my-agents', page: 'my-agents' },
]);
const activeTab = ref(contentTabs.value[0].page);
const onTabChange = (newTab) => {
  activeTab.value = newTab;

  if (agentsTeamStore.myAgents.status === null && newTab === 'my-agents') {
    agentsTeamStore.loadMyAgents();
  }
};

const agentsData = computed(() =>
  activeTab.value === 'official' ? officialAgents.data : myAgents.data,
);
const isLoadingAgents = computed(
  () => officialAgents.status === 'loading' || myAgents.status === 'loading',
);

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

  &__tabs {
    margin-bottom: -$unnnic-spacing-sm;
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $unnnic-spacing-sm;
  }
}
</style>

<template>
  <section
    class="agents-gallery"
    data-testid="agents-gallery"
  >
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
      data-testid="agents-gallery-tabs"
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
      v-model="search[activeTab]"
      iconLeft="search"
      :placeholder="$t('router.agents_team.gallery.search_placeholder')"
      data-testid="search-input"
    />

    <section
      :class="[
        'agents-gallery__cards',
        {
          'agents-gallery__cards--empty': isMyAgentsEmpty,
        },
      ]"
      data-testid="agent-cards"
    >
      <template v-if="isLoadingAgents">
        <AgentCard
          v-for="(_, index) in Array(3)"
          :key="index"
          loading
          data-testid="agent-card-loading"
        />
      </template>

      <template v-else>
        <UnnnicIntelligenceText
          v-if="isSearchEmpty"
          color="neutral-clean"
          family="secondary"
          size="body-gt"
          tag="p"
        >
          {{ $t('router.agents_team.gallery.no_agent_found') }}
        </UnnnicIntelligenceText>

        <template v-else>
          <AgentCard
            v-if="activeTab === 'my-agents'"
            data-testid="agent-card-empty"
            empty
          />

          <AgentCard
            v-for="agent in agentsData"
            :key="agent.uuid"
            :title="agent.name"
            :description="agent.description"
            :skills="agent.skills"
            :uuid="agent.uuid"
            :assigned="agent.assigned"
            data-testid="agent-card"
          />
        </template>
      </template>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { debounce } from 'lodash';

import AgentCard from '@/components/Brain/AgentsTeam/AgentCard.vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

const agentsTeamStore = useAgentsTeamStore();
const officialAgents = agentsTeamStore.officialAgents;
const myAgents = agentsTeamStore.myAgents;

const contentTabs = ref([
  { title: 'official', page: 'official' },
  { title: 'my-agents', page: 'my-agents' },
]);
const activeTab = ref(contentTabs.value[0].page);
const search = ref({
  official: '',
  'my-agents': '',
});
const isSearchEmpty = ref(false);

const agentsData = computed(() =>
  activeTab.value === 'official' ? officialAgents.data : myAgents.data,
);
const isLoadingAgents = computed(
  () => officialAgents.status === 'loading' || myAgents.status === 'loading',
);
const isMyAgentsEmpty = computed(
  () =>
    activeTab.value === 'my-agents' &&
    myAgents.data.length === 0 &&
    !isLoadingAgents.value,
);

function updateSearchEmpty() {
  const currentAgents = agentsData.value;
  const currentSearch = search.value[activeTab.value];

  isSearchEmpty.value =
    currentSearch.trim() !== '' && currentAgents.length === 0;
}

function onTabChange(newTab) {
  activeTab.value = newTab;

  if (agentsTeamStore.myAgents.status === null && newTab === 'my-agents') {
    agentsTeamStore.loadMyAgents();
  }

  updateSearchEmpty();
}

onMounted(() => {
  agentsTeamStore.loadOfficialAgents();
});

const debouncedSearch = (callback) => debounce(callback, 300);
watch(
  () => search.value['my-agents'],
  debouncedSearch(async (search) => {
    await agentsTeamStore.loadMyAgents({ search });
    updateSearchEmpty();
  }),
);
watch(
  () => search.value['official'],
  debouncedSearch(async (search) => {
    await agentsTeamStore.loadOfficialAgents({ search });
    updateSearchEmpty();
  }),
);
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

    &--empty {
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>

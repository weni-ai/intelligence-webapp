<template>
  <section class="active-team">
    <UnnnicIntelligenceText
      tag="h2"
      family="secondary"
      size="body-lg"
      color="neutral-darkest"
      weight="bold"
      data-testid="title"
    >
      {{ $t('router.agents_team.active_team.title') }}
    </UnnnicIntelligenceText>

    <section
      v-if="isLoadingTeam || activeTeam.length"
      class="active-team__cards"
    >
      <template v-if="isLoadingTeam">
        <AssignAgentCard
          v-for="(_, index) in Array(3)"
          :key="index"
          loading
          data-testid="loading-card"
        />
      </template>

      <template v-else>
        <AssignAgentCard
          v-for="agent in activeTeam"
          :key="agent.uuid"
          :agent="agent"
          :assignment="false"
          data-testid="team-card"
        />
      </template>
    </section>

    <section
      v-if="!isLoadingTeam && activeTeam.length === 0"
      class="active-team__empty"
      data-testid="empty-state"
    >
      <UnnnicIntelligenceText
        tag="p"
        family="secondary"
        size="body-gt"
        color="neutral-dark"
        weight="bold"
      >
        {{ $t('router.agents_team.active_team.no_team') }}
      </UnnnicIntelligenceText>

      <section class="empty__description">
        <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
        <i18n-t
          class="description__text"
          keypath="router.agents_team.active_team.no_team_description"
          tag="p"
        >
          <template #link>
            <a
              class="description__link"
              :href="agentsTeamStore.linkToCreateAgent"
              target="_blank"
              >{{ $t('router.agents_team.active_team.create_agent') }}</a
            >
          </template>
        </i18n-t>
      </section>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AssignAgentCard from '@/components/Brain/AgentsTeam/AssignAgentCard.vue';

const agentsTeamStore = useAgentsTeamStore();
const activeTeam = computed(
  () => agentsTeamStore.activeTeam.data?.agents || [],
);

const isLoadingTeam = computed(
  () => agentsTeamStore.activeTeam.status === 'loading',
);

onMounted(() => {
  agentsTeamStore.loadActiveTeam();
});
</script>

<style lang="scss" scoped>
.active-team {
  border-radius: $unnnic-border-radius-md;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

  padding: $unnnic-spacing-sm;

  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  &__empty {
    border-radius: $unnnic-border-radius-md;
    border: $unnnic-border-width-thinner dashed $unnnic-color-neutral-cleanest;

    padding: $unnnic-spacing-xl $unnnic-spacing-sm;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: $unnnic-color-neutral-lightest;

    .empty__description {
      display: flex;
      align-items: center;
      gap: 2px;

      .description__text {
        font-family: $unnnic-font-family-secondary;
        font-size: $unnnic-font-size-body-md;
        color: $unnnic-color-neutral-cloudy;
      }

      .description__link {
        font-size: $unnnic-font-size-body-md;
        color: $unnnic-color-neutral-cloudy;
        text-decoration: underline;
      }
    }
  }

  &__cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: $unnnic-spacing-sm;
  }
}
</style>

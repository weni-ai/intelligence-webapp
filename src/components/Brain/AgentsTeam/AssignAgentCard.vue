<template>
  <section
    data-testid="assign-agent-card"
    :class="['assign-agent-card', { 'assign-agent-card--empty': empty }]"
  >
    <AssignAgentCardSkeleton
      v-if="loading"
      data-testid="assign-agent-card-skeleton"
    />

    <AssignAgentCardEmpty
      v-else-if="empty"
      data-testid="assign-agent-card-empty"
    />

    <section
      v-else
      class="assign-agent-card__content"
    >
      <UnnnicIntelligenceText
        tag="p"
        family="secondary"
        size="body-gt"
        color="neutral-darkest"
        weight="bold"
        data-testid="title"
      >
        {{ agent.name }}
      </UnnnicIntelligenceText>

      <UnnnicIntelligenceText
        v-if="agent.description && assignment"
        class="content__description"
        tag="p"
        family="secondary"
        size="body-gt"
        color="neutral-cloudy"
        data-testid="description"
      >
        {{ agent.description }}
      </UnnnicIntelligenceText>

      <section class="content__skills">
        <Skill
          v-for="skill in agent.skills"
          :key="skill.name"
          :title="skill.name"
          :icon="skill.icon"
          data-testid="skill"
        />
      </section>
    </section>

    <UnnnicButton
      v-if="!loading && !empty && assignment"
      :class="[
        'assign-agent-card__button',
        { 'assign-agent-card__button--assigned': agent.assigned },
      ]"
      :text="
        agent.assigned
          ? $t('router.agents_team.card.assigned')
          : $t('router.agents_team.card.assign')
      "
      :type="agent.assigned ? 'secondary' : 'primary'"
      :iconLeft="agent.assigned ? 'check' : ''"
      size="small"
      :loading="isAssigning"
      data-testid="assign-button"
      @click="
        !agent.assigned && agent.credentials?.length > 0
          ? toggleDrawer()
          : toggleAgentAssignment()
      "
    />
  </section>

  <AssignAgentDrawer
    v-model="isAssignDrawerOpen"
    :agent="agent"
    :isAssigning="isDrawerAssigning"
    @assign="toggleDrawerAssigning"
  />
</template>

<script setup>
import { ref } from 'vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AssignAgentCardSkeleton from './AssignAgentCardSkeleton.vue';
import AssignAgentCardEmpty from './AssignAgentCardEmpty.vue';
import Skill from './Skill.vue';
import AssignAgentDrawer from './AssignAgentDrawer.vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  agent: {
    type: Object,
    default: () => ({}),
  },
  assignment: {
    type: Boolean,
    default: true,
  },
  empty: {
    type: Boolean,
    default: false,
  },
});

const agentsTeamStore = useAgentsTeamStore();

const isAssignDrawerOpen = ref(false);
const isAssigning = ref(false);
const isDrawerAssigning = ref(false);

async function toggleDrawer() {
  isAssignDrawerOpen.value = !isAssignDrawerOpen.value;
}

async function assignAgent() {
  try {
    await agentsTeamStore.toggleAgentAssignment({
      uuid: props.agent.uuid,
      is_assigned: !props.agent.assigned,
    });
  } catch (error) {
    console.error(error);
  }
}

async function toggleAgentAssignment() {
  isAssigning.value = true;
  await assignAgent();
  isAssigning.value = false;
}

async function toggleDrawerAssigning() {
  isDrawerAssigning.value = true;
  await assignAgent();
  isDrawerAssigning.value = false;
  toggleDrawer();
}
</script>

<style lang="scss" scoped>
.assign-agent-card {
  border-radius: $unnnic-border-radius-md;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-cleanest;

  padding: $unnnic-spacing-sm;

  display: grid;
  gap: $unnnic-spacing-sm;
  align-content: space-between;

  &--empty {
    display: flex;

    cursor: pointer;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;

    .content__description {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .content__skills {
      display: flex;
      gap: $unnnic-spacing-nano;
      flex-wrap: wrap;
    }
  }

  :deep(.unnnic-button).assign-agent-card__button {
    &--assigned {
      color: $unnnic-color-weni-600;
    }

    [class*='icon'] {
      color: $unnnic-color-weni-600;
    }
  }
}
</style>

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
        {{ title }}
      </UnnnicIntelligenceText>

      <UnnnicIntelligenceText
        v-if="description"
        class="content__description"
        tag="p"
        family="secondary"
        size="body-gt"
        color="neutral-cloudy"
        data-testid="description"
        :title="description"
      >
        {{ description }}
      </UnnnicIntelligenceText>

      <section class="content__skills">
        <Skill
          v-for="skill in skills"
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
        { 'assign-agent-card__button--assigned': assigned },
      ]"
      :text="
        assigned
          ? $t('router.agents_team.card.assigned')
          : $t('router.agents_team.card.assign')
      "
      :type="assigned ? 'secondary' : 'primary'"
      :iconLeft="assigned ? 'check' : ''"
      size="small"
      :loading="isAssigning"
      data-testid="assign-button"
      @click="toggleAgentAssignment"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AssignAgentCardSkeleton from './AssignAgentCardSkeleton.vue';
import AssignAgentCardEmpty from './AssignAgentCardEmpty.vue';
import Skill from './Skill.vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  /**
   * An array of skills where each skill is an object with the following properties:
   * @property {string} name - The name of the skill
   * @property {string} icon - The icon of the skill
   */
  skills: {
    type: Array,
    default: () => [],
    validator(skills) {
      return skills.every((skill) => 'name' in skill && 'icon' in skill);
    },
  },
  assignment: {
    type: Boolean,
    default: true,
  },
  assigned: {
    type: Boolean,
    default: false,
  },
  uuid: {
    type: String,
    default: '',
  },
  empty: {
    type: Boolean,
    default: false,
  },
});

const isAssigning = ref(false);
const agentsTeamStore = useAgentsTeamStore();

async function toggleAgentAssignment() {
  isAssigning.value = true;

  try {
    await agentsTeamStore.toggleAgentAssignment({
      uuid: props.uuid,
      is_assigned: !props.assigned,
    });
  } catch (error) {
    console.error(error);
  } finally {
    isAssigning.value = false;
  }
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

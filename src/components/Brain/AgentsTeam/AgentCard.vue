<template>
  <section class="agent-card">
    <AgentCardSkeleton v-if="loading" />

    <section
      v-else
      class="agent-card__content"
    >
      <UnnnicIntelligenceText
        tag="p"
        family="secondary"
        size="body-gt"
        color="neutral-darkest"
        weight="bold"
      >
        {{ title }}
      </UnnnicIntelligenceText>

      <UnnnicIntelligenceText
        v-if="description"
        tag="p"
        family="secondary"
        size="body-gt"
        color="neutral-cloudy"
      >
        {{ description }}
      </UnnnicIntelligenceText>

      <section class="content__skills">
        <Skill
          v-for="skill in skills"
          :key="skill.name"
          :title="skill.name"
          :icon="skill.icon"
        />
      </section>
    </section>

    <UnnnicButton
      v-if="!loading && assignment"
      :class="[
        'agent-card__button',
        { 'agent-card__button--assigned': assigned },
      ]"
      :text="
        assigned
          ? $t('router.agents_team.card.assigned')
          : $t('router.agents_team.card.assign')
      "
      :type="assigned ? 'tertiary' : 'primary'"
      :iconLeft="assigned ? 'check' : ''"
      size="small"
      :loading="isAssigning"
      @click="toggleAgentAssignment"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AgentCardSkeleton from './AgentCardSkeleton.vue';
import Skill from './Skill.vue';

defineEmits(['assign']);

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    required: true,
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
    required: true,
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
    required: true,
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
.agent-card {
  border-radius: $unnnic-border-radius-md;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-cleanest;

  padding: $unnnic-spacing-sm;

  display: grid;
  gap: $unnnic-spacing-sm;
  align-content: space-between;

  &__content,
  &__content-loading {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;

    .content__skills {
      display: flex;
      gap: $unnnic-spacing-nano;
      flex-wrap: wrap;
    }
  }

  :deep(.unnnic-button).agent-card__button {
    &--assigned {
      color: $unnnic-color-weni-600;
    }

    [class*='icon'] {
      color: $unnnic-color-weni-600;
    }
  }
}
</style>

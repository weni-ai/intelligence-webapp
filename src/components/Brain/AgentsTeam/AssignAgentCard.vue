<template>
  <section
    data-testid="assign-agent-card"
    class="assign-agent-card"
  >
    <AssignAgentCardSkeleton
      v-if="loading"
      data-testid="assign-agent-card-skeleton"
    />

    <section
      v-else
      class="assign-agent-card__content"
    >
      <header class="content__header">
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

        <section
          v-if="!assignment"
          class="header__actions"
          data-testid="assign-agent-card-actions"
        >
          <UnnnicTag
            type="next"
            :text="
              agent.is_official
                ? $t('router.agents_team.card.official')
                : $t('router.agents_team.card.custom')
            "
            :scheme="agent.is_official ? 'weni' : 'aux-purple'"
            data-testid="agent-tag"
          />

          <ContentItemActions
            :actions="assignAgentHeaderActions"
            minWidth="175px"
          />
        </section>
      </header>

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
      v-if="!loading && assignment"
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
import { computed, ref } from 'vue';

import { useAgentsTeamStore } from '@/store/AgentsTeam';
import { useTuningsStore } from '@/store/Tunings';

import i18n from '@/utils/plugins/i18n';

import AssignAgentCardSkeleton from './AssignAgentCardSkeleton.vue';
import AssignAgentDrawer from './AssignAgentDrawer.vue';
import ContentItemActions from '@/views/repository/content/ContentItemActions.vue';
import Skill from './Skill.vue';

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
});

const emit = defineEmits(['agent-assigned']);

const agentsTeamStore = useAgentsTeamStore();

const isAssignDrawerOpen = ref(false);
const isAssigning = ref(false);
const isDrawerAssigning = ref(false);

const tuningsStore = useTuningsStore();

const assignAgentHeaderActions = computed(() => [
  {
    scheme: 'aux-red-500',
    icon: 'delete',
    text: i18n.global.t('router.agents_team.card.remove_agent'),
    onClick: toggleAgentAssignment,
  },
]);

async function toggleDrawer() {
  isAssignDrawerOpen.value = !isAssignDrawerOpen.value;
}

async function assignAgent() {
  const isAssigned = props.assignment ? !props.agent.assigned : false;
  try {
    const { status } = await agentsTeamStore.toggleAgentAssignment({
      external_id: props.agent.external_id,
      is_assigned: isAssigned,
    });

    if (status === 'success' && isAssigned) emit('agent-assigned');
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
  await tuningsStore.fetchCredentials();
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

  &__content {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;

    .content__header {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: $unnnic-spacing-xs;

      .header__actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }

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

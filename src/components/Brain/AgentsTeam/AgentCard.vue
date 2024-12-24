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
      :text="$t('router.agents_team.card.assign')"
      type="primary"
      size="small"
      @click="$emit('assign')"
    />
  </section>
</template>

<script setup>
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
    required: true,
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
});
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
}
</style>

<template>
  <section
    data-testid="preview-agent-card"
    class="preview-agent-card"
    :class="{
      'preview-agent-card--active': active,
      'preview-agent-card--standby': !active,
      'preview-agent-card--animated': active && type === 'agent',
    }"
  >
    <VueParticles
      v-if="active && type === 'agent'"
      class="preview-agent-card__particles"
    />

    <AgentIcon
      v-if="type === 'manager'"
      icon="Manager"
      class="preview-agent-card__agent-icon"
      :data-testid="`preview-agent-card-icon-${type}`"
    />
    <AgentIcon
      v-else-if="type === 'agent' && active"
      :icon="icon"
      class="preview-agent-card__agent-icon"
      :data-testid="`preview-agent-card-icon-${type}`"
    />

    <section class="preview-agent-card__content">
      <UnnnicIntelligenceText
        data-testid="preview-agent-card-name"
        tag="h3"
        family="secondary"
        class="preview-agent-card__title"
        size="body-gt"
        color="neutral-darkest"
        weight="bold"
      >
        {{ name }}
      </UnnnicIntelligenceText>
      <UnnnicIntelligenceText
        data-testid="preview-agent-card-status"
        tag="p"
        family="secondary"
        class="preview-agent-card__status"
        :class="{
          'preview-agent-card__status--active': active,
        }"
        size="body-md"
        color="weni-600"
      >
        {{ currentTask || 'Standby' }}
      </UnnnicIntelligenceText>
    </section>
  </section>
</template>

<script setup>
import VueParticles from './Particles.vue';
import AgentIcon from '../AgentsTeam/AgentIcon.vue';

defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['manager', 'agent'].includes(value),
  },
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  currentTask: {
    type: String,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.preview-agent-card {
  position: relative;
  box-shadow: $unnnic-shadow-level-near;
  border-radius: $unnnic-border-radius-md;
  background-color: $unnnic-color-background-white;
  border: $unnnic-border-width-thinner solid transparent;

  padding: $unnnic-spacing-sm;

  display: flex;
  align-items: center;
  gap: $unnnic-spacing-ant;

  height: fit-content;

  z-index: 1;

  transition: all 0.3s ease;

  transform-origin: center;
  transform-box: fill-box;

  overflow: hidden;

  &__particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    border-radius: $unnnic-border-radius-md;
  }

  &--animated {
    transform: scale(1.02);
  }

  &--standby {
    box-shadow: none;
    border-color: $unnnic-color-neutral-soft;

    .preview-agent-card__title {
      color: $unnnic-color-neutral-cleanest;
    }

    .preview-agent-card__status {
      color: $unnnic-color-neutral-cleanest;
    }
  }

  &__agent-icon {
    width: $unnnic-icon-size-lg;
    height: $unnnic-icon-size-lg;
  }

  &__content {
    overflow: hidden;
  }

  .preview-agent-card__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

<template>
  <section
    class="agent-card"
    :class="{
      'agent-card--active': active,
      'agent-card--standby': !active,
      'agent-card--animated': active && type === 'agent',
    }"
  >
    <UnnnicAvatarIcon
      v-if="type === 'manager'"
      class="agent-card__icon"
      size="sm"
      icon="neurology"
      scheme="aux-purple"
    />
    <section class="agent-card__content">
      <UnnnicIntelligenceText
        tag="h3"
        family="secondary"
        class="agent-card__title"
        size="body-gt"
        color="neutral-darkest"
        weight="bold"
      >
        {{ name }}
      </UnnnicIntelligenceText>
      <UnnnicIntelligenceText
        tag="p"
        family="secondary"
        class="agent-card__status"
        :class="{
          'agent-card__status--active': active,
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
.agent-card {
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

  &--animated {
    transform: scale(1.02);
  }

  &--standby {
    box-shadow: none;
    border-color: $unnnic-color-neutral-soft;

    .agent-card__title {
      color: $unnnic-color-neutral-cleanest;
    }

    .agent-card__status {
      color: $unnnic-color-neutral-cleanest;
    }
  }

  &__content {
    overflow: hidden;
  }

  .agent-card__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

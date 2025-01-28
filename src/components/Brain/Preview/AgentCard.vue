<template>
  <section
    class="agent-card"
    :class="{
      'agent-card--active': active,
      'agent-card--standby': !active,
    }"
  >
    <UnnnicAvatarIcon
      v-if="type === 'manager'"
      class="agent-card__icon"
      size="sm"
      icon="neurology"
      scheme="aux-purple"
    />
    <div class="agent-card__content">
      <h3 class="agent-card__title">{{ name }}</h3>
      <p
        class="agent-card__status"
        :class="{ 'agent-card__status--active': active }"
      >
        {{ active ? currentTask : 'Standby' }}
      </p>
    </div>
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
  background-color: $unnnic-color-background-white;
  border-radius: $unnnic-border-radius-md;
  padding: $unnnic-spacing-sm;
  box-shadow: $unnnic-shadow-level-near;

  &--standby {
    border: $unnnic-border-width-thinner solid $unnnic-color-neutral-cleanest;
    box-shadow: none;

    .agent-card__title {
      color: $unnnic-color-neutral-cleanest;
    }

    .agent-card__status {
      color: $unnnic-color-neutral-cleanest;
    }
  }

  &__title {
    font-size: $unnnic-font-size-body-gt;
    color: $unnnic-color-neutral-darkest;
    margin: 0;
    line-height: calc($unnnic-font-size-body-gt + $unnnic-line-height-md);
  }

  &__status {
    font-size: $unnnic-font-size-body-md;
    color: $unnnic-color-neutral-cloudy;
    margin: 0;
    line-height: calc($unnnic-font-size-body-md + $unnnic-line-height-small);
    &--active {
      color: $unnnic-color-weni-600;
    }
  }
}
</style>

<template>
  <header
    :class="[
      'agent-builder-header',
      { 'agent-builder-header--actions-lg': actionsSize === 'lg' },
      props.class,
    ]"
    data-testid="agent-builder-header"
  >
    <section class="agent-builder-header__title">
      <UnnnicIntelligenceText
        tag="h1"
        size="title-sm"
        family="secondary"
        weight="bold"
        color="neutral-darkest"
        data-testid="agent-builder-header-title"
      >
        {{ currentBrainRoute?.title }}
      </UnnnicIntelligenceText>
      <UnnnicIntelligenceText
        tag="h2"
        size="body-gt"
        family="secondary"
        color="neutral-cloudy"
        data-testid="agent-builder-header-description"
      >
        {{ currentBrainRoute?.description }}
      </UnnnicIntelligenceText>
    </section>

    <slot name="actions" />
  </header>

  <UnnnicDivider
    v-if="withDivider"
    ySpacing="md"
    data-testid="agent-builder-header-divider"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import useBrainRoutes from '@/composables/useBrainRoutes';

const route = useRoute();

const props = defineProps({
  class: {
    type: String,
    default: '',
  },

  withDivider: {
    type: Boolean,
    default: true,
  },

  actionsSize: {
    type: String,
    default: 'md',
    validator: (value) => {
      return ['md', 'lg'].includes(value);
    },
  },
});

const currentBrainRoute = computed(() => {
  const brainRoutes = useBrainRoutes();
  return (
    brainRoutes.value.find((e) => e.page === route.name) || brainRoutes.value[0]
  );
});
</script>

<style lang="scss" scoped>
.agent-builder-header {
  display: grid;
  grid-template-columns: 9fr 3fr;
  gap: $unnnic-spacing-sm;
  align-items: center;

  &__title {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;
  }

  &--actions-lg {
    grid-template-columns: 6fr 6fr;
  }
}
</style>

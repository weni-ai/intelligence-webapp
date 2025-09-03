<template>
  <section class="tunings__upgrade-to-multi-agents">
    <header class="upgrade-to-multi-agents__header">
      <UnnnicIntelligenceText
        color="neutral-darkest"
        family="secondary"
        size="body-gt"
        weight="bold"
        data-testid="upgrade-to-multi-agents-title"
      >
        {{ $t('router.tunings.upgrade_to_multi_agents.title') }}
      </UnnnicIntelligenceText>

      <UnnnicIntelligenceText
        color="neutral-cloudy"
        family="secondary"
        size="body-gt"
        data-testid="upgrade-to-multi-agents-description"
      >
        {{ $t('router.tunings.upgrade_to_multi_agents.description') }}
      </UnnnicIntelligenceText>
    </header>

    <UnnnicButton
      :text="$t('router.tunings.upgrade_to_multi_agents.button')"
      data-testid="upgrade-to-multiagents-button"
      @click="handleUpgradeToMultiagentsModal"
    />
  </section>
</template>

<script setup>
const emit = defineEmits(['upgrade-to-multiagents']);

function handleUpgradeToMultiagentsModal() {
  emit('upgrade-to-multiagents');
}
</script>

<style lang="scss" scoped>
.tunings__upgrade-to-multi-agents {
  border-radius: $unnnic-border-radius-md;
  border: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

  padding: $unnnic-spacing-sm;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: $unnnic-spacing-sm;

  .upgrade-to-multi-agents__header {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;
    grid-column: 1 / -1;
  }
}
</style>

<template>
  <section
    class="settings-agents-team"
    data-testid="settings-agents-team"
  >
    <AgentsPreview data-testid="agents-preview" />

    <HumanSupport data-testid="human-support" />
  </section>
</template>

<script setup>
import AgentsPreview from './AgentsPreview.vue';
import HumanSupport from './HumanSupport.vue';
</script>

<style lang="scss" scoped>
.settings-agents-team {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-md;
}
</style>

<template>
  <section class="settings-agents-team">
    <AgentsPreview />

    <HumanSupport />
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

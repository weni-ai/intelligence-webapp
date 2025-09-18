<template>
  <section class="instructions">
    <AgentBuilderHeader
      data-testid="instructions-header"
      :withDivider="false"
      actionsSize="none"
    />
    <NewInstruction data-testid="new-instruction" />
  </section>
</template>

<script setup>
import AgentBuilderHeader from '@/components/AgentBuilder/Header.vue';
import NewInstruction from '@/components/AgentBuilder/Instructions/NewInstruction.vue';
</script>

<style lang="scss" scoped>
.instructions {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-md;
}
</style>

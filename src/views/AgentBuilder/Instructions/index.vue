<template>
  <section class="instructions">
    <AgentBuilderHeader
      data-testid="instructions-header"
      :withDivider="false"
      actionsSize="none"
    />
    <NewInstruction data-testid="new-instruction" />
    <InstructionsList data-testid="instructions-list" />
  </section>
</template>

<script setup>
import AgentBuilderHeader from '@/components/AgentBuilder/Header.vue';
import NewInstruction from '@/components/AgentBuilder/Instructions/NewInstruction.vue';
import InstructionsList from '@/components/AgentBuilder/Instructions/InstructionsList.vue';
</script>

<style lang="scss" scoped>
.instructions {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-md;
}
</style>

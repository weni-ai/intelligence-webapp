<template>
  <section class="conversations">
    <SupervisorPerformance data-testid="supervisor-performance" />

    <ConversationsTable data-testid="conversations-table" />
  </section>
</template>

<script setup>
import SupervisorPerformance from '../SupervisorPerformance.vue';
import ConversationsTable from './ConversationsTable/index.vue';
</script>

<style scoped lang="scss">
.conversations {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: $unnnic-spacing-sm;

  overflow: hidden;
}
</style>

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
  gap: $unnnic-spacing-sm;
}
</style>

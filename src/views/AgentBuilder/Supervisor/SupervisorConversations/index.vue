<template>
  <section class="conversations">
    <SupervisorPerformance class="conversations__performance" />

    <ConversationsTable />
  </section>
</template>

<script setup>
import SupervisorPerformance from '../SupervisorPerformance.vue';
import ConversationsTable from './ConversationsTable.vue';
</script>

<style scoped lang="scss">
.conversations {
  display: grid;
  gap: $unnnic-spacing-sm;
}
</style>

<template>
  <section class="conversations">
    <SupervisorFilters data-testid="supervisor-filters" />

    <ConversationsTable data-testid="conversations-table" />
  </section>
</template>

<script setup>
import SupervisorFilters from '../SupervisorFilters/index.vue';
import ConversationsTable from './ConversationsTable/index.vue';
</script>

<style scoped lang="scss">
.conversations {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;
}
</style>

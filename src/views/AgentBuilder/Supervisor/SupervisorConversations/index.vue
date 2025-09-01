<template>
  <section class="conversations">
    <SupervisorFilters data-testid="supervisor-filters" />

    <ConversationsTable
      ref="conversationsTable"
      data-testid="conversations-table"
    />
  </section>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

import SupervisorFilters from '../SupervisorFilters/index.vue';
import ConversationsTable from './ConversationsTable/index.vue';

const conversationsTable = ref(null);

defineExpose({
  loadMoreConversations: () => conversationsTable.value.loadMoreConversations(),
});
</script>

<style scoped lang="scss">
.conversations {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;
}
</style>

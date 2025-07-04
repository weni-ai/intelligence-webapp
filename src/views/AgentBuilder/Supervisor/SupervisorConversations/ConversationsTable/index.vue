<template>
  <ConversationsSearch />

  <section
    class="conversations-table"
    data-testid="conversations-table"
  >
    <UnnnicIntelligenceText
      data-testid="conversations-count"
      class="conversations-table__count"
      tag="p"
      color="neutral-clean"
      family="primary"
      size="body-gt"
    >
      {{
        $t('agent_builder.supervisor.conversations_count', {
          count: conversations.count,
        })
      }}
    </UnnnicIntelligenceText>

    <ConversationRow
      v-for="conversation in conversations.results"
      :key="conversation.id"
      data-testid="conversation-row"
      :conversation="conversation"
      :isSelected="conversation.id === supervisorStore.selectedConversation?.id"
      @click="handleRowClick(conversation)"
    />
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';

import { useSupervisorStore } from '@/store/Supervisor';

import ConversationsSearch from './ConversationsSearch.vue';
import ConversationRow from './ConversationRow.vue';

const supervisorStore = useSupervisorStore();

const conversations = computed(() => supervisorStore.conversations.data);

const pagination = ref({
  page: 1,
  interval: 15,
});

function handleRowClick(row) {
  supervisorStore.selectConversation(null);
  nextTick(() => {
    supervisorStore.selectConversation(row.id);
  });
}

watch(
  () => supervisorStore.filters,
  async () => {
    await supervisorStore.loadConversations();

    const { selectedConversation, filters } = supervisorStore;
    if (filters.conversationId && !selectedConversation) {
      supervisorStore.selectConversation(filters.conversationId);
    }
  },
  { immediate: true, deep: true },
);

watch(
  [
    () => supervisorStore.filters.search,
    () => supervisorStore.filters.start,
    () => supervisorStore.filters.end,
  ],
  ([newSearch, newStart, newEnd], [oldSearch, oldStart, oldEnd]) => {
    if (newSearch !== oldSearch || newStart !== oldStart || newEnd !== oldEnd) {
      pagination.value.page = 1;
    }
  },
);

watch(
  () => pagination.value.page,
  (newPage) => {
    supervisorStore.loadConversations(newPage);
  },
);
</script>

<style scoped lang="scss">
.conversations-table {
  &__count {
    margin-bottom: $unnnic-spacing-xs;
  }
}
</style>

<template>
  <ConversationsSearch />

  <table
    class="conversations-table"
    data-testid="conversations-table"
  >
    <template v-if="conversations.count > 0">
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

      <tbody class="conversations-table__rows">
        <ConversationRow
          v-for="conversation in conversations.results"
          :key="conversation.id"
          data-testid="conversation-row"
          :conversation="conversation"
          :isSelected="
            conversation.id === supervisorStore.selectedConversation?.id
          "
          @click="handleRowClick(conversation)"
        />
      </tbody>
    </template>
    <section
      v-else
      class="conversations-table__empty"
    >
      <UnnnicIcon
        icon="sms"
        size="avatar-sm"
        scheme="neutral-soft"
        filled
      />

      <UnnnicIntelligenceText
        color="neutral-cloudy"
        family="secondary"
        size="body-gt"
      >
        {{ $t('agent_builder.supervisor.conversations_empty') }}
      </UnnnicIntelligenceText>
    </section>
  </table>
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
  margin-right: 0;
  margin-bottom: $unnnic-spacing-sm;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  &__count {
    margin-bottom: $unnnic-spacing-xs;
  }

  &__rows {
    $scroll-margin: calc($unnnic-spacing-nano / 2 + $unnnic-spacing-nano);

    height: 100%;

    overflow-y: auto;

    padding-right: $scroll-margin;
    margin-right: $scroll-margin;
  }

  &__empty {
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    gap: $unnnic-spacing-nano;
  }
}
</style>

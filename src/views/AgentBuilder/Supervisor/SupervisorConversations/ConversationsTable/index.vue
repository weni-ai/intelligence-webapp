<template>
  <ConversationsSearch />

  <section class="conversations-table">
    <!-- <UnnnicTableNext
      v-model:pagination="pagination.page"
      :class="{
        'conversations-table__table': true,
        'conversations-table__table--with-results':
          supervisorStore.conversations.status === 'complete' &&
          conversations.results.length,
      }"
      data-testid="conversations-table"
      hideHeaders
      :headers="table.headers"
      :rows="table.rows"
      :paginationTotal="conversations.count"
      :paginationInterval="pagination.interval"
      :isLoading="supervisorStore.conversations.status === 'loading'"
      @row-click="handleRowClick"
    /> -->

    <UnnnicIntelligenceText
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
      :conversation="conversation"
      :isSelected="conversation.id === supervisorStore.selectedConversation?.id"
      @click="handleRowClick(conversation)"
    />
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';

import { useSupervisorStore } from '@/store/Supervisor';

import i18n from '@/utils/plugins/i18n';

import ConversationsSearch from './ConversationsSearch.vue';
import ConversationRow from './ConversationRow.vue';

const t = (key) => i18n.global.t(key);
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

const selectedConversationIndex = computed(() =>
  conversations.value.results?.findIndex(
    (conversation) =>
      conversation.id === supervisorStore.selectedConversation?.id,
  ),
);

function highlightRow(index) {
  const rowsElements = document.querySelectorAll(
    '.unnnic-table-next__body-row',
  );

  rowsElements.forEach((row) => {
    row.style.backgroundColor = '';
  });

  if (rowsElements[index]) {
    const UNNNIC_COLOR_BACKGROUND_SKY = '#F4F6F8';
    rowsElements[index].style.backgroundColor = UNNNIC_COLOR_BACKGROUND_SKY;
  }
}

watch(selectedConversationIndex, (newConversation) => {
  highlightRow(newConversation);
});

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

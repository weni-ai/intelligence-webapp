<template>
  <table
    class="conversations-table"
    data-testid="conversations-table"
  >
    <template v-if="hasConversations || conversations.status === 'loading'">
      <UnnnicIntelligenceText
        v-if="conversations.status !== 'loading'"
        data-testid="conversations-count"
        class="conversations-table__count"
        tag="p"
        color="neutral-clean"
        family="primary"
        size="body-gt"
      >
        {{
          $t('agent_builder.supervisor.conversations_count', {
            count: conversations.data.count,
          })
        }}
      </UnnnicIntelligenceText>

      <tbody
        class="conversations-table__rows"
        @scroll="handleScroll"
      >
        <ConversationRow
          v-for="conversation in conversations.data.results"
          :key="conversation.id"
          data-testid="conversation-row"
          :conversation="conversation"
          :isSelected="
            conversation.id === supervisorStore.selectedConversation?.id
          "
          @click="handleRowClick(conversation)"
        />

        <template v-if="conversations.status === 'loading'">
          <ConversationRow
            v-for="i in 8"
            :key="i"
            isLoading
          />
        </template>
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

import ConversationRow from './ConversationRow.vue';

const supervisorStore = useSupervisorStore();

const conversations = computed(() => supervisorStore.conversations);
const hasConversations = computed(() => conversations.value.data.count > 0);

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
  (newFilters, oldFilters) => {
    if (newFilters.conversationId !== oldFilters.conversationId) return;

    if (pagination.value.page === 1) {
      supervisorStore.loadConversations();
    } else {
      pagination.value.page = 1;
    }
  },
  { deep: true },
);

function handleScroll(event) {
  const { next } = conversations.value.data;

  if (!next || ['loading', 'error'].includes(conversations.value.status)) {
    return;
  }

  const { scrollTop, clientHeight, scrollHeight } = event.target;

  const safeDistance = 10;
  const isInScrollBottom =
    scrollTop + clientHeight + safeDistance >= scrollHeight;

  const shouldLoadMore = isInScrollBottom;

  if (shouldLoadMore) {
    pagination.value.page++;
    supervisorStore.loadConversations(pagination.value.page);
  }
}
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

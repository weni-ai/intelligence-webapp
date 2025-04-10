<template>
  <UnnnicTableNext
    v-model:pagination="pagination.page"
    :class="{
      'conversations-table': true,
      'conversations-table--with-results':
        supervisorStore.conversations.status === 'complete' &&
        conversations.results.length,
    }"
    hideHeaders
    :headers="table.headers"
    :rows="table.rows"
    :paginationTotal="pagination.total"
    :paginationInterval="pagination.interval"
    :isLoading="supervisorStore.conversations.status === 'loading'"
    @row-click="handleRowClick"
  />
</template>

<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import Unnnic from '@weni/unnnic-system';

import { useSupervisorStore } from '@/store/Supervisor';

import i18n from '@/utils/plugins/i18n';

import ConversationInfos from './ConversationInfos.vue';
import ConversationDate from './ConversationDate.vue';

const t = (key) => i18n.global.t(key);
const supervisorStore = useSupervisorStore();

const conversations = computed(() => supervisorStore.conversations.data);

const pagination = ref({
  page: 1,
  interval: 15,
  total: conversations.value.count || 0,
});

function handleRowClick(row) {
  supervisorStore.selectConversation(row.id);
}

const table = computed(() => {
  const getTagProps = (human_support) => {
    if (human_support) {
      return {
        scheme: 'aux-blue-500',
        leftIcon: 'forward',
        text: t('agent_builder.supervisor.forwarded_human_support.title'),
      };
    }

    return {
      scheme: 'aux-green-500',
      leftIcon: 'check',
      text: t('agent_builder.supervisor.attended_by_agent.title'),
    };
  };
  return {
    headers: [
      { content: '' },
      { content: '', size: 'auto' },
      { content: '', size: 'auto' },
    ],
    rows: conversations.value.results?.map(
      ({ urn, created_on, last_message, human_support, id }) => {
        const dateComponent = {
          component: ConversationDate,
          props: {
            date: created_on,
          },
        };

        const tagComponent = {
          component: Unnnic.unnnicTag,
          props: {
            type: 'default',
            ...getTagProps(human_support),
          },
        };

        const infoComponent = {
          component: ConversationInfos,
          props: {
            urn,
            lastMessage: last_message,
          },
        };

        return {
          content: [infoComponent, tagComponent, dateComponent],
          id,
        };
      },
    ),
  };
});

const selectedConversationIndex = computed(() =>
  conversations.value.results?.findIndex(
    (conversation) => conversation.id === supervisorStore.selectedConversation,
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

onMounted(() => {
  supervisorStore.loadConversations();
});
</script>

<style scoped lang="scss">
.conversations-table {
  :deep(.unnnic-table-next__body) {
    .unnnic-table-next__body-row {
      $table-radius: $unnnic-border-radius-md;

      &:first-child {
        border-radius: $table-radius $table-radius 0 0;
      }

      &:last-child {
        border-radius: 0 0 $table-radius $table-radius;
      }
    }

    .unnnic-table-next__body-cell:nth-child(2) {
      padding: $unnnic-spacing-ant 0;
    }
  }

  &--with-results {
    :deep(.unnnic-table-next__body-row):hover {
      background-color: $unnnic-color-background-sky;

      cursor: pointer;
    }
  }
}
</style>

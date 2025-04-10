<template>
  <UnnnicTableNext
    v-model:pagination="pagination.page"
    class="conversations-table"
    hideHeaders
    :headers="table.headers"
    :rows="table.rows"
    :paginationTotal="pagination.total"
    :paginationInterval="pagination.interval"
    :isLoading="supervisorStore.conversations.status === 'loading'"
  />
</template>

<script setup>
import { onMounted, computed, ref } from 'vue';
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
          events: {},
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
}
</style>

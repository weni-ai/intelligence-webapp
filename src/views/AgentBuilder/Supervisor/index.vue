<template>
  <section
    :class="[
      'supervisor',
      { 'supervisor--with-conversation': selectedConversation },
    ]"
  >
    <SupervisorHeader
      class="supervisor__header"
      data-testid="header"
    />
    <SupervisorConversations
      class="supervisor__conversations"
      data-testid="supervisor-conversations"
    />
    <Conversation
      v-if="selectedConversation"
      class="supervisor__conversation"
      data-testid="supervisor-conversation"
    />
  </section>
</template>

<script setup>
import { computed, onBeforeMount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import SupervisorHeader from './SupervisorHeader.vue';
import SupervisorConversations from './SupervisorConversations/index.vue';
import Conversation from './SupervisorConversations/Conversation/index.vue';

import { useSupervisorStore } from '@/store/Supervisor';
import { cleanParams } from '@/utils/http';

const supervisorStore = useSupervisorStore();
const router = useRouter();
const route = useRoute();

const selectedConversation = computed(() => {
  return supervisorStore.selectedConversation;
});

function updateQuery(filters = supervisorStore.filters) {
  const cleanedFilters = cleanParams(filters);
  router.replace({
    query: {
      ...cleanedFilters,
    },
  });
}

watch(
  () => supervisorStore.filters,
  () => {
    updateQuery();
  },
  { deep: true },
);

watch(
  () => supervisorStore.queryConversationUrn,
  (conversationUrn) => {
    updateQuery({
      ...route.query,
      conversationUrn,
    });
  },
);

onBeforeMount(async () => {
  updateQuery();

  const { selectedConversation, queryConversationUrn } = supervisorStore;

  if (queryConversationUrn && !selectedConversation) {
    supervisorStore.selectConversation(queryConversationUrn);
  }
});
</script>

<style lang="scss">
.supervisor {
  margin: -$unnnic-spacing-sm;

  min-height: 100%;

  display: grid;
  grid-template-rows: auto 1fr;

  overflow: hidden auto;

  &--with-conversation {
    grid-template-columns: 7fr 5fr;
  }

  &__header {
    padding: $unnnic-spacing-sm;
    padding-bottom: $unnnic-spacing-md;

    grid-column: 1 / 1;
    grid-row: 1 / 2;
  }

  &__conversations {
    padding-left: $unnnic-spacing-sm;

    grid-column: 1 / 1;
    grid-row: 2 / 3;

    & > * {
      margin-right: $unnnic-spacing-sm;
    }
  }

  &__conversation {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
  }
}
</style>

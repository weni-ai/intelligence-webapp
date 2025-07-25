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
import { useRouter } from 'vue-router';

import SupervisorHeader from './SupervisorHeader.vue';
import SupervisorConversations from './SupervisorConversations/index.vue';
import Conversation from './SupervisorConversations/Conversation/index.vue';

import { useSupervisorStore } from '@/store/Supervisor';
import { cleanParams } from '@/utils/http';

const supervisorStore = useSupervisorStore();
const router = useRouter();

const selectedConversation = computed(() => {
  return supervisorStore.selectedConversation;
});

function updateQuery() {
  const cleanedFilters = cleanParams(supervisorStore.filters);
  router.replace({
    query: {
      ...cleanedFilters,
    },
  });
}

watch(
  () => supervisorStore.filters,
  (filters) => {
    updateQuery();
  },
  { deep: true },
);

onBeforeMount(() => {
  updateQuery();
});
</script>

<style lang="scss">
.supervisor {
  margin: -$unnnic-spacing-sm;

  display: grid;

  overflow: hidden auto;

  &--with-conversation {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
  }

  &__header {
    padding: $unnnic-spacing-sm;
    padding-bottom: $unnnic-spacing-md;

    grid-column: 1 / 1;
    grid-row: 1 / 2;
  }

  &__conversations {
    padding: 0 $unnnic-spacing-sm;

    grid-column: 1 / 1;
    grid-row: 2 / 3;
  }

  &__conversation {
    grid-column: 2 / 3;
    grid-row: 1 / 3;
  }
}
</style>

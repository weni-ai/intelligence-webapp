<template>
  <section
    :class="[
      'supervisor',
      { 'supervisor--with-conversation': selectedConversation },
    ]"
  >
    <BrainHeader class="supervisor__header" />
    <SupervisorConversations class="supervisor__conversations" />
    <Conversation
      v-if="selectedConversation"
      class="supervisor__conversation"
    />
  </section>
</template>

<script setup>
import { computed } from 'vue';

import BrainHeader from '@/components/Brain/BrainHeader.vue';
import SupervisorConversations from '@/views/AgentBuilder/Supervisor/SupervisorConversations/index.vue';
import Conversation from '@/views/AgentBuilder/Supervisor/SupervisorConversations/Conversation/index.vue';

import { useSupervisorStore } from '@/store/Supervisor';

const supervisorStore = useSupervisorStore();

const selectedConversation = computed(() => {
  return supervisorStore.selectedConversation;
});
</script>

<style scoped lang="scss">
.supervisor {
  margin: -$unnnic-spacing-sm;

  display: grid;

  &--with-conversation {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
  }

  &__header {
    padding: $unnnic-spacing-sm;
    padding-bottom: 0;

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

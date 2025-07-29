<template>
  <section
    class="conversation"
    data-testid="conversation"
  >
    <ConversationHeader data-testid="conversation-header" />

    <section
      ref="messagesContainer"
      class="conversation__messages"
      data-testid="messages-container"
      @scroll="handleScroll"
    >
      <template v-if="status === 'loading' && !results">
        <QuestionAndAnswer
          v-for="loadMessage in 3"
          :key="loadMessage"
          :data="loadMessage"
          :isLoading="true"
          data-testid="loading-message"
        />
      </template>

      <NoMessagesFound
        v-else-if="results?.length === 0"
        data-testid="no-messages-found"
      />

      <template v-else>
        <QuestionAndAnswer
          v-for="message in results"
          :key="message.id"
          :data="message"
          :isLoading="false"
          data-testid="message"
        />

        <ForwardedHumanSupport
          v-if="conversation?.human_support"
          class="conversation__forwarded-human-support"
          data-testid="forwarded-human-support"
        />
      </template>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import { useSupervisorStore } from '@/store/Supervisor';

import QuestionAndAnswer from './QuestionAndAnswer/index.vue';
import ForwardedHumanSupport from './QuestionAndAnswer/ForwardedHumanSupport.vue';
import NoMessagesFound from './NoMessagesFound.vue';
import ConversationHeader from './Header.vue';

const supervisorStore = useSupervisorStore();

const conversation = computed(() => supervisorStore.selectedConversation);
const status = computed(() => conversation.value?.data?.status);
const results = computed(() => conversation.value?.data?.results);

const messagesContainer = ref(null);

async function loadConversationData() {
  await supervisorStore.loadSelectedConversationData();

  messagesContainer.value.scrollTo({
    top: messagesContainer.value.scrollHeight,
  });
}

watch(
  () => supervisorStore.queryConversationId,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      loadConversationData();
    }
  },
);

onMounted(() => {
  loadConversationData();
});

function handleScroll(event) {
  if (event.target.scrollTop === 0) {
    supervisorStore.loadSelectedConversationData({ next: true });
  }
}
</script>

<style lang="scss" scoped>
.conversation {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  border-left: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

  &__messages {
    padding: $unnnic-spacing-sm;

    overflow: hidden auto;

    height: 100%;
  }

  &__forwarded-human-support {
    margin-top: $unnnic-spacing-sm;
  }
}
</style>

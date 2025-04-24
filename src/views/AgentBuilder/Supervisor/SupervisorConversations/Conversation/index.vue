<template>
  <section class="conversation">
    <header class="conversation__header">
      <UnnnicIntelligenceText
        tag="h2"
        color="neutral-darkest"
        family="secondary"
        size="title-sm"
        weight="bold"
      >
        {{ conversation.urn }}
      </UnnnicIntelligenceText>

      <button
        class="header__close-button"
        @click="supervisorStore.selectConversation(null)"
      >
        <UnnnicIcon
          icon="close"
          size="md"
          scheme="neutral-cloudy"
        />
      </button>
    </header>

    <section
      class="conversation__messages"
      @scroll="handleScroll"
    >
      <template
        v-if="
          conversation.data.status === 'loading' && !conversation.data.results
        "
      >
        <QuestionAndAnswer
          v-for="loadMessage in 3"
          :key="loadMessage"
          :data="loadMessage"
          :isLoading="true"
        />
      </template>
      <template v-else>
        <QuestionAndAnswer
          v-for="message in conversation.data.results"
          :key="message.id"
          :data="message"
          :isLoading="false"
        />

        <ForwardedHumanSupport
          v-if="conversation.human_support"
          class="conversation__forwarded-human-support"
        />
      </template>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';

import { useSupervisorStore } from '@/store/Supervisor';

import QuestionAndAnswer from './QuestionAndAnswer/index.vue';
import ForwardedHumanSupport from './QuestionAndAnswer/ForwardedHumanSupport.vue';

const supervisorStore = useSupervisorStore();

const conversation = computed(() => supervisorStore.selectedConversation);

onMounted(() => {
  supervisorStore.loadSelectedConversationData();
});

function handleScroll(event) {
  if (event.target.scrollTop === 0) {
    supervisorStore.loadSelectedConversationData({ next: true });
  }
}
</script>

<style lang="scss" scoped>
$conversation-border: $unnnic-border-width-thinner solid
  $unnnic-color-neutral-soft;
.conversation {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  border-left: $conversation-border;

  &__header {
    padding: $unnnic-spacing-sm;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom: $conversation-border;

    .header__close-button {
      background-color: transparent;
      border: none;

      display: flex;

      cursor: pointer;
    }
  }

  &__messages {
    padding: $unnnic-spacing-sm;

    overflow: hidden auto;
  }

  &__forwarded-human-support {
    margin-top: $unnnic-spacing-sm;
  }
}
</style>

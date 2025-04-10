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
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';

import { useSupervisorStore } from '@/store/Supervisor';

const supervisorStore = useSupervisorStore();

const conversation = computed(() => supervisorStore.selectedConversation);

onMounted(() => {
  supervisorStore.loadSelectedConversationData();
});
</script>

<style lang="scss" scoped>
$conversation-border: $unnnic-border-width-thinner solid
  $unnnic-color-neutral-soft;
.conversation {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-md;

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
}
</style>

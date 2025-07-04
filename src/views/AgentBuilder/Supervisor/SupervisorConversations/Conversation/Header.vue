<template>
  <header class="conversation__header">
    <UnnnicIntelligenceText
      tag="h2"
      color="neutral-darkest"
      family="secondary"
      size="title-sm"
      weight="bold"
      data-testid="conversation-title"
    >
      {{ conversation?.urn }}
    </UnnnicIntelligenceText>

    <button
      class="header__close-button"
      data-testid="close-button"
      @click="supervisorStore.selectConversation(null)"
    >
      <UnnnicIcon
        data-testid="close-button-icon"
        icon="close"
        size="md"
        scheme="neutral-cloudy"
      />
    </button>
  </header>
</template>

<script setup>
import { useSupervisorStore } from '@/store/Supervisor';
import { computed } from 'vue';

const supervisorStore = useSupervisorStore();

const conversation = computed(() => supervisorStore.selectedConversation);
</script>

<style lang="scss" scoped>
.conversation__header {
  padding: $unnnic-spacing-sm;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: $unnnic-border-width-thinner solid $unnnic-color-neutral-soft;

  .header__close-button {
    background-color: transparent;
    border: none;

    display: flex;

    cursor: pointer;
  }
}
</style>

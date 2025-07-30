<template>
  <p
    class="supervisor-header-details"
    @click="handleDetailsModal"
  >
    {{ $t('agent_builder.supervisor.learn_details_conversations') }}
  </p>

  <UnnnicModalDialog
    :modelValue="isDetailsModalOpen"
    showCloseIcon
    showActionsDivider
    size="md"
    title="About conversation"
    class="supervisor-header-details__modal"
    @update:model-value="handleDetailsModal"
  >
    <section class="modal__topic">
      <p class="topic__title">What is a conversation?</p>
      <p class="topic__description">
        We consider all messages exchanged within 24 hours of the contact's
        first message as a single conversation.
      </p>
    </section>

    <section class="modal__topic">
      <p class="topic__title">When is a conversation considered resolved?</p>
      <p class="topic__description">{{ description }}</p>
    </section>
  </UnnnicModalDialog>
</template>

<script setup>
import { ref } from 'vue';

const isDetailsModalOpen = ref(false);

function handleDetailsModal() {
  isDetailsModalOpen.value = !isDetailsModalOpen.value;
}

const description = `A conversation is only considered resolved when the user goes beyond the initial greeting and actually engages:
- Asks questions;
- Requests data;
- Confirms information;
- Receives guidance that allows them to complete all or part of their request.
Messages limited to greetings, emojis or closed without useful interaction remain unresolved, while interaction that delivers value to the user is marked as resolved.
`;
</script>

<style scoped lang="scss">
.supervisor-header-details {
  display: initial;

  color: $unnnic-color-neutral-cloudy;
  font-size: $unnnic-font-size-body-gt;
  font-weight: $unnnic-font-weight-bold;
  font-family: $unnnic-font-family-secondary;
  text-decoration: underline;

  cursor: pointer;

  &__modal {
    .modal__topic {
      margin-bottom: $unnnic-spacing-sm;

      .topic__title {
        margin-bottom: $unnnic-spacing-nano;
        color: $unnnic-color-neutral-dark;
        font-size: $unnnic-font-size-body-gt;
        font-family: $unnnic-font-family-secondary;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
        font-weight: $unnnic-font-weight-bold;
      }

      .topic__description {
        color: $unnnic-color-neutral-cloudy;
        font-size: $unnnic-font-size-body-md;
        font-family: $unnnic-font-family-secondary;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-md;
        white-space: pre-line;
      }
    }
  }
}
</style>

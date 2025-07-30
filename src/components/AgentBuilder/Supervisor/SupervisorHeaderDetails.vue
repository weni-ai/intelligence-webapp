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
    :title="detailsTranslation('title')"
    class="supervisor-header-details__modal"
    @update:model-value="handleDetailsModal"
  >
    <section class="modal__topic">
      <p class="topic__title">
        {{ detailsTranslation('what_is_a_conversation') }}
      </p>
      <p class="topic__description">
        {{ detailsTranslation('what_is_a_conversation_description') }}
      </p>
    </section>

    <section class="modal__topic">
      <p class="topic__title">
        {{ detailsTranslation('when_is_a_conversation_considered_resolved') }}
      </p>
      <p class="topic__description">
        {{ detailsTranslation('description') }}
      </p>
    </section>
  </UnnnicModalDialog>
</template>

<script setup>
import { ref } from 'vue';

import i18n from '@/utils/plugins/i18n';
const t = i18n.global.t;
const detailsTranslation = (key) =>
  t(`agent_builder.supervisor.conversation_details.${key}`);

const isDetailsModalOpen = ref(false);

function handleDetailsModal() {
  isDetailsModalOpen.value = !isDetailsModalOpen.value;
}
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
        font-size: $unnnic-font-size-body-gt;
        font-family: $unnnic-font-family-secondary;
        line-height: $unnnic-line-height-md + $unnnic-font-size-body-gt;
        white-space: pre-line;
      }
    }
  }
}
</style>

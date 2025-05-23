<template>
  <section
    :class="[
      `messages__${message.type}`,
      { 'messages--with-components': hasRenderedComponent },
      { 'messages__is-media': isMedia(text) },
    ]"
  >
    <DotTyping v-if="message.status === 'loading'" />

    <template v-else-if="isStatus(message)">
      <UnnnicIcon
        v-if="message.type === 'media_and_location_unavailable'"
        icon="warning"
        scheme="neutral-cloudy"
        size="sm"
      />
      <UnnnicIntelligenceText
        class="messages__status"
        color="neutral-cloudy"
        family="secondary"
        weight="regular"
        size="body-md"
      >
        {{ statusDescription(message) }}
      </UnnnicIntelligenceText>
    </template>

    <template v-else-if="message.type === 'order'">
      <MessageCatalogOrder :order="JSON.parse(message.text)" />
    </template>

    <template v-else>
      <PreviewMedia
        v-if="isMedia(text)"
        :media="text"
      />
      <Markdown
        v-else
        :class="`messages__${message.type}__content`"
        :content="text"
      />

      <AnswerSources
        v-if="
          shouldShowSources &&
          message.type === 'answer' &&
          message.sources?.length
        "
        :sources="message.sources"
      />

      <AnswerFeedback
        v-if="message.type === 'answer' && message.question_uuid"
        v-model:feedback="message.feedback"
        :contentBaseUuid="store.state.router.contentBaseUuid"
        :questionUuid="message.question_uuid"
      />

      <slot name="components" />
    </template>
  </section>
</template>

<script setup>
import { computed, useSlots } from 'vue';
import { useStore } from 'vuex';

import { lowerFirstCapitalLetter } from '@/utils/handleLetters';
import { getFileType } from '@/utils/medias';
import i18n from '@/utils/plugins/i18n';

import AnswerSources from '@/components/QuickTest/AnswerSources.vue';
import AnswerFeedback from '@/components/QuickTest/AnswerFeedback.vue';
import DotTyping from '@/components/QuickTest/DotTyping.vue';
import Markdown from '@/components/Markdown.vue';
import PreviewMedia from '@/components/PreviewMedia.vue';
import MessageCatalogOrder from './MessageCatalogOrder.vue';

const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
  shouldShowSources: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const store = useStore();

const text = computed(() => {
  const { message } = props;
  return message?.response?.msg?.text || message?.response || message.text;
});

const slots = useSlots();

const hasRenderedComponent = computed(
  // To ensure that the slot has a component rendered by the MessageComponentResolver
  () => slots?.components()[0].props?.message?.text,
);

const isStatus = (message) => {
  return [
    'change',
    'flowstart',
    'flowsend',
    'message_forwarded_to_brain',
    'media_and_location_unavailable',
  ].includes(message.type);
};

const isMedia = (message) => {
  return !!getFileType(message);
};

const handleLetter = (message) => {
  return lowerFirstCapitalLetter(message);
};

const statusDescription = (message) => {
  if (message.type === 'change') {
    return i18n.global.t('router.preview.field_changed_to_value', {
      field: handleLetter(i18n.global.t(message.name)),
      value: message.value,
    });
  }

  if (message.type === 'flowstart') {
    return i18n.global.t('router.preview.flow_started', { name: message.name });
  }

  if (message.type === 'flowsend') {
    return i18n.global.t('router.preview.flow_finished');
  }

  if (message.type === 'message_forwarded_to_brain') {
    return i18n.global.t('router.preview.message_forwarded_to_brain');
  }

  if (message.type === 'media_and_location_unavailable') {
    return i18n.global.t('router.preview.media_and_location_unavailable');
  }
};
</script>

<style lang="scss" scoped>
.messages {
  &--with-components {
    width: 100%;
  }

  &__question,
  &__answer,
  &__order {
    max-width: 75%;
    color: $unnnic-color-neutral-dark;

    border-radius: $unnnic-border-radius-md;
    padding: $unnnic-spacing-ant;

    &.messages__is-media {
      width: 100%;
      padding: $unnnic-spacing-nano;
    }

    &__content {
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-regular;
    }

    :deep(p) {
      margin: 0;
      overflow-wrap: anywhere;
    }
  }

  &__question,
  &__order {
    align-self: self-end;
    color: $unnnic-color-neutral-white;
    background-color: $unnnic-color-weni-600;
    margin-left: 1.875 * $unnnic-font-size;
  }

  &__answer {
    align-self: self-start;
    background-color: $unnnic-color-background-solo;
    margin-right: 1.875 * $unnnic-font-size;
  }

  &__change,
  &__flowstart,
  &__flowsend,
  &__message_forwarded_to_brain,
  &__media_and_location_unavailable {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $unnnic-spacing-nano;

    + .messages__change {
      margin-top: -$unnnic-spacing-nano;
    }

    .messages__status {
      overflow: hidden;
    }
  }
}
</style>

<template>
  <div class="preview">
    <PreviewPlaceholder
      v-if="shouldShowPreviewPlaceholder"
      class="messages"
    />

    <div
      v-else
      class="messages"
    >
      <div
        ref="messagesRef"
        class="messages__content"
      >
        <MessageDisplay
          v-for="(message, index) in flowPreviewStore?.messages"
          :key="index"
          :message="message"
          :shouldShowSources="true"
        >
          <template #quick-replies="{ message }">
            <section
              v-if="shouldShowQuickReplies(message)"
              class="quick-replies"
            >
              <UnnnicButton
                v-for="(reply, index) in flowPreviewStore?.preview.quickReplies"
                :key="`reply-${index}`"
                type="secondary"
                size="small"
                class="quick-replies__button"
                @click="sendReply(reply)"
              >
                {{ reply }}
              </UnnnicButton>
            </section>
          </template>
        </MessageDisplay>
      </div>
    </div>

    <QuickTestWarn
      v-if="shouldShowRequireSaveWarn"
      icon="info"
      :text="$t('router.preview.save_changes_to_test_the_agent')"
    />

    <div class="write-message">
      <MessageInput
        v-model="message"
        class="write-message__message-input"
        :placeholder="$t('webapp.home.bases.preview_tests_placeholder')"
        @send="sendMessage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';

import MessageDisplay from '@/components/QuickTest/MessageDisplay.vue';
import QuickTestWarn from '@/components/QuickTest/QuickTestWarn.vue';
import PreviewPlaceholder from '../../Brain/Preview/Placeholder.vue';
import MessageInput from './MessageInput.vue';

import { useProfileStore } from '@/store/Profile';
import { useFlowPreviewStore } from '@/store/FlowPreview';
import { useStore } from 'vuex';

import { getFileType } from '@/utils/medias';

import nexusaiAPI from '@/api/nexusaiAPI';
import i18n from '@/utils/plugins/i18n';

const emit = defineEmits(['messages']);

const store = useStore();
const profileStore = useProfileStore();
const flowPreviewStore = useFlowPreviewStore();

const message = ref('');
const messages = ref(flowPreviewStore.messages);
const messagesRef = ref(null);

const shouldShowPreviewPlaceholder = computed(
  () => messages.value.length === 0,
);

const shouldShowRequireSaveWarn = computed(() => {
  return (
    !store.getters.isBrainSaveButtonDisabled ||
    profileStore.hasChanged ||
    store.getters.hasBrainContentTextChanged
  );
});

function isEventCardBrain(event) {
  if (event.type !== 'webhook_called' || !event.url) {
    return false;
  }

  const url = new URL(event.url);

  return (
    url.origin === new URL(runtimeVariables.get('NEXUS_API_BASE_URL')).origin &&
    url.pathname === '/messages' &&
    url.searchParams.has('token')
  );
}

watch(
  () => flowPreviewStore.messages,
  (newMessages) => {
    emit('messages', newMessages);
  },
  { deep: true },
);

watch(
  () => flowPreviewStore.preview.session?.status,
  (value, previous) => {
    if (previous === 'waiting' && value === 'completed') {
      flowPreviewStore.addMessage({
        type: 'flowsend',
        name: '',
        question_uuid: null,
        feedback: {
          value: null,
          reason: null,
        },
      });

      const lastEvent =
        flowPreviewStore.preview.events
          .filter(({ type }) => !['info'].includes(type))
          .at(-1) || {};

      const shouldForwardToBrain = isEventCardBrain(lastEvent);

      if (shouldForwardToBrain) {
        flowPreviewStore.addMessage({
          type: 'message_forwarded_to_brain',
          name: '',
          question_uuid: null,
          feedback: {
            value: null,
            reason: null,
          },
        });

        const { text: lastQuestion } = flowPreviewStore.messages.findLast(
          ({ type }) => type === 'question',
        );

        answer(lastQuestion);
      }
    }
  },
);

function isMedia(message) {
  return !!getFileType(message);
}

function isTheLastMessage(message) {
  return messages.value.filter(() => ['answer', 'question']).at(-1) === message;
}

function shouldShowQuickReplies(message) {
  return (
    message.type === 'answer' &&
    isTheLastMessage(message) &&
    flowPreviewStore.preview.quickReplies?.length
  );
}

function treatEvents(replace, events) {
  const processedEvents = events
    .filter(({ type }) => type === 'msg_created')
    .map(({ type, msg }) => {
      if (type === 'msg_created') {
        return {
          type: 'answer',
          text: msg.text,
          status: 'loaded',
          question_uuid: null,
          feedback: {
            value: null,
            reason: null,
          },
        };
      }
    });

  flowPreviewStore.replaceMessage(replace, processedEvents);
  scrollToLastMessage();
}

async function flowResume(answer, { text }) {
  const {
    data: { events },
  } = await flowPreviewStore.previewResume(text);

  treatEvents(answer, events);
}

async function flowStart(answer, flow) {
  const {
    data: { events },
  } = await flowPreviewStore.previewStart({
    flowName: flow.name,
    flowUuid: flow.uuid,
    flowParams: flow.params,
  });

  treatEvents(answer, events);
}

function sendReply(replyText) {
  message.value = replyText;
  sendMessage();
}

function sendMessage() {
  const isFileMessage = typeof message.value !== 'string';
  const messageText = isFileMessage ? message.value : message.value.trim();

  if (!messageText) {
    return;
  }

  flowPreviewStore.addMessage({
    type: 'question',
    text: messageText,
  });

  message.value = '';
  scrollToLastMessage();

  setTimeout(() => answer(messageText), 400);
}

async function answer(question) {
  const answer = {
    type: 'answer',
    text: '',
    status: 'loading',
    question_uuid: null,
    feedback: {
      value: null,
      reason: null,
    },
  };

  flowPreviewStore.addMessage(answer);
  scrollToLastMessage();

  const handleError = () => {
    flowPreviewStore.removeMessage(answer);
  };

  if (flowPreviewStore.preview.session?.status === 'waiting') {
    flowResume(answer, { text: question });
    return;
  }

  let questionMediaUrl;
  const isQuestionMedia = isMedia(question);
  if (isQuestionMedia) {
    try {
      const isGeolocationMedia = typeof question === 'string';
      if (isGeolocationMedia) {
        questionMediaUrl = `geo:${question}`;
      } else {
        const {
          data: { file_url },
        } = await nexusaiAPI.router.preview.uploadFile({
          projectUuid: store.state.Auth.connectProjectUuid,
          file: question,
        });
        questionMediaUrl = file_url;
      }
    } catch {
      handleError();
      return;
    }
  }

  try {
    const { data } = await nexusaiAPI.router.preview.create({
      projectUuid: store.state.Auth.connectProjectUuid,
      text: isQuestionMedia ? '' : question,
      attachments: questionMediaUrl ? [questionMediaUrl] : [],
      contact_urn: flowPreviewStore.preview.contact.urns[0],
    });

    flowPreviewStore.treatAnswerResponse(answer, data, {
      onBroadcast: () => scrollToLastMessage(),
      onFlowStart: (answer, data) => {
        flowStart(answer, {
          name: data.name,
          uuid: data.uuid,
          params: data.params,
        });
      },
      fallbackMessage: i18n.global.t('quick_test.unable_to_find_an_answer'),
    });
  } catch {
    handleError();
  }
}

function scrollToLastMessage() {
  nextTick(() => {
    messagesRef.value?.lastElementChild?.scrollIntoView({
      behavior: 'smooth',
    });
  });
}

onMounted(() => {
  flowPreviewStore.previewInit({
    contentBaseUuid: store.state.router.contentBaseUuid,
  });

  window.brainPreviewAddMessage = (messageData) => {
    flowPreviewStore.addMessage(messageData);
  };
});
</script>

<style lang="scss" scoped>
.quick-replies {
  margin-top: $unnnic-spacing-sm;
  display: flex;
  flex-direction: column;
  row-gap: $unnnic-spacing-nano;

  &__button {
    color: $unnnic-color-weni-600;
  }
}

.button-send-message :deep(svg .primary) {
  fill: $unnnic-color-weni-600;
}

.preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: $unnnic-spacing-sm;
  row-gap: $unnnic-spacing-xs;

  .messages {
    flex: 1;
    padding: 0 $unnnic-spacing-sm;

    $scroll-size: $unnnic-inline-nano;

    overflow: hidden overlay;

    &__content {
      height: 0;
      display: flex;
      flex-direction: column;
      row-gap: $unnnic-spacing-xs;
    }

    &::-webkit-scrollbar {
      width: $scroll-size;
    }

    &::-webkit-scrollbar-thumb {
      background: $unnnic-color-neutral-clean;
      border-radius: $unnnic-border-radius-pill;
    }

    &::-webkit-scrollbar-track {
      background: $unnnic-color-neutral-soft;
      border-radius: $unnnic-border-radius-pill;
    }

    &__empty-text {
      color: $unnnic-color-neutral-clean;
      font-family: $unnnic-font-family-secondary;
      font-size: $unnnic-font-size-body-gt;
      line-height: $unnnic-font-size-body-gt + $unnnic-line-height-md;
      font-weight: $unnnic-font-weight-regular;
    }
  }

  .write-message {
    display: flex;
    column-gap: $unnnic-spacing-nano;

    padding: $unnnic-spacing-sm;
    padding-top: $unnnic-spacing-sm - $unnnic-spacing-xs;

    &__message-input {
      width: 100%;
    }
  }
}
</style>

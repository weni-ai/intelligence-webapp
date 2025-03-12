<template>
  <div class="quick-test">
    <PreviewPlaceholder
      v-if="shouldShowPreviewPlaceholder"
      class="messages"
    />

    <div
      v-else
      class="messages"
    >
      <div
        ref="messages"
        class="messages__content"
      >
        <section
          v-if="!messages.length"
          class="messages__empty-text"
        >
          {{ $t('quick_test.send_a_message') }}
        </section>

        <section
          v-for="(message, index) in messages"
          :key="index"
          :class="[
            `messages__${message.type}`,
            { 'messages__is-media': isMedia(message.text) },
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
          <template v-else>
            <PreviewMedia
              v-if="isMedia(message.text)"
              :media="message.text"
            />
            <Markdown
              v-else
              :class="`messages__${message.type}__content`"
              :content="message.text"
            />

            <AnswerSources
              v-if="shouldShowSources(message)"
              :sources="message.sources"
            />

            <AnswerFeedback
              v-if="message.type === 'answer' && message.question_uuid"
              v-model:feedback="message.feedback"
              :contentBaseUuid="contentBaseUuid"
              :questionUuid="message.question_uuid"
            />

            <section
              v-if="shouldShowQuickReplies(message)"
              class="quick-replies"
            >
              <UnnnicButton
                v-for="(reply, index) in preview.quickReplies"
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
        </section>
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
        :placeholder="
          usePreview
            ? $t('webapp.home.bases.preview_tests_placeholder')
            : $t('webapp.home.bases.tests_placeholder')
        "
        @send="sendMessage"
      />
    </div>
  </div>
</template>

<script>
import { get, attempt } from 'lodash';
import { reactive } from 'vue';

import AnswerSources from '@/components/QuickTest/AnswerSources.vue';
import AnswerFeedback from '@/components/QuickTest/AnswerFeedback.vue';
import DotTyping from '@/components/QuickTest/DotTyping.vue';
import Markdown from '@/components/Markdown.vue';
import PreviewMedia from '@/components/PreviewMedia.vue';
import QuickTestWarn from '@/components/QuickTest/QuickTestWarn.vue';
import PreviewPlaceholder from '../../Brain/Preview/Placeholder.vue';
import MessageInput from './MessageInput.vue';
import { useProfileStore } from '@/store/Profile';

import FlowPreview from '@/utils/FlowPreview';
import { lowerFirstCapitalLetter } from '@/utils/handleLetters';
import { getFileType } from '@/utils/medias';

import nexusaiAPI from '@/api/nexusaiAPI';

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

export default {
  name: 'RepositoryContentTests',

  components: {
    Markdown,
    PreviewMedia,
    AnswerSources,
    AnswerFeedback,
    QuickTestWarn,
    PreviewPlaceholder,
    MessageInput,
    DotTyping,
  },

  mixins: [FlowPreview],

  props: {
    contentBaseUuid: {
      type: String,
      required: false,
      default: '',
    },
    contentBaseLanguage: {
      type: String,
      required: false,
      default: '',
    },
    usePreview: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  emits: ['messages'],

  setup() {
    const profileStore = useProfileStore();

    return {
      profileStore,
    };
  },

  data() {
    return {
      message: '',

      messages: [],
    };
  },

  computed: {
    shouldShowPreviewPlaceholder() {
      return this.usePreview && this.messages.length === 0;
    },

    shouldShowRequireSaveWarn() {
      return (
        this.usePreview &&
        (!this.$store.getters.isBrainSaveButtonDisabled ||
          this.profileStore.hasChanged ||
          this.$store.getters.hasBrainContentTextChanged)
      );
    },

    language() {
      const language = this.contentBaseLanguage;

      if (!language) {
        return null;
      }

      return language.indexOf('-') === -1
        ? language
        : language.slice(0, language.indexOf('-')) +
            language.slice(language.indexOf('-')).toUpperCase();
    },
  },

  watch: {
    messages: {
      deep: true,
      handler(newMessages) {
        this.$emit('messages', newMessages);
      },
    },
    'preview.session.status'(value, previous) {
      if (previous === 'waiting' && value === 'completed') {
        this.messages.push({
          type: 'flowsend',
          name: '',
          question_uuid: null,
          feedback: {
            value: null,
            reason: null,
          },
        });

        const lastEvent =
          this.preview.events
            .filter(({ type }) => !['info'].includes(type))
            .at(-1) || {};

        const shouldForwardToBrain = isEventCardBrain(lastEvent);

        if (shouldForwardToBrain) {
          this.messages.push({
            type: 'message_forwarded_to_brain',
            name: '',
            question_uuid: null,
            feedback: {
              value: null,
              reason: null,
            },
          });

          const { text: lastQuestion } = this.messages.findLast(
            ({ type }) => type === 'question',
          );

          this.answer(lastQuestion);
        }
      }
    },
  },

  mounted() {
    if (this.usePreview) {
      this.previewInit({
        contentBaseUuid: this.$store.state.router.contentBaseUuid,
      });

      window.brainPreviewAddMessage = (message) => {
        this.messages.push(message);
      };
    }
  },

  methods: {
    shouldShowSources(message) {
      return (
        this.usePreview && message.type === 'answer' && message.sources?.length
      );
    },

    shouldShowQuickReplies(message) {
      return (
        this.usePreview &&
        message.type === 'answer' &&
        this.isTheLastMessage(message) &&
        this.preview.quickReplies?.length
      );
    },

    isStatus(message) {
      return [
        'change',
        'flowstart',
        'flowsend',
        'message_forwarded_to_brain',
        'media_and_location_unavailable',
      ].includes(message.type);
    },

    isMedia(message) {
      return !!getFileType(message);
    },

    statusDescription(message) {
      if (message.type === 'change') {
        return this.$t('router.preview.field_changed_to_value', {
          field: this.handleLetter(this.$t(message.name)),
          value: message.value,
        });
      }

      if (message.type === 'flowstart') {
        return this.$t('router.preview.flow_started', { name: message.name });
      }

      if (message.type === 'flowsend') {
        return this.$t('router.preview.flow_finished');
      }

      if (message.type === 'message_forwarded_to_brain') {
        return this.$t('router.preview.message_forwarded_to_brain');
      }

      if (message.type === 'media_and_location_unavailable') {
        return this.$t('router.preview.media_and_location_unavailable');
      }
    },

    handleLetter(message) {
      return lowerFirstCapitalLetter(message);
    },

    isTheLastMessage(message) {
      return (
        this.messages.filter(({ type }) => ['answer', 'question']).at(-1) ===
        message
      );
    },

    treatEvents(replace, events) {
      this.messages.splice(
        this.messages.indexOf(replace),
        1,
        ...events
          .filter(({ type, text }) => type === 'msg_created')
          .map(({ type, msg, text }) => {
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
          }),
      );

      this.scrollToLastMessage();
    },

    async flowResume(answer, { text }) {
      const {
        data: { events },
      } = await this.previewResume(text);

      this.treatEvents(answer, events);
    },

    async flowStart(answer, flow) {
      const {
        data: { events },
      } = await this.previewStart({
        flowName: flow.name,
        flowUuid: flow.uuid,
        flowParams: flow.params,
      });

      this.treatEvents(answer, events);
    },

    sendReply(message) {
      this.message = message;

      this.sendMessage();
    },

    sendMessage() {
      const isFileMessage = typeof this.message !== 'string';
      const message = isFileMessage ? this.message : this.message.trim();

      if (!message) {
        return;
      }

      this.messages.push({
        type: 'question',
        text: message,
      });

      this.message = '';

      this.scrollToLastMessage();

      setTimeout(() => this.answer(message), 400);
    },

    async answer(question) {
      const answer = reactive({
        type: 'answer',
        text: '',
        status: 'loading',
        question_uuid: null,
        feedback: {
          value: null,
          reason: null,
        },
      });

      this.messages.push(answer);
      this.scrollToLastMessage();

      const handleError = () => {
        this.messages.splice(this.messages.indexOf(answer), 1);
      };

      if (this.usePreview) {
        if (this.preview.session?.status === 'waiting') {
          this.flowResume(answer, { text: question });
          return;
        }

        let questionMediaUrl;
        const isQuestionMedia = this.isMedia(question);
        if (isQuestionMedia) {
          try {
            const isGeolocationMedia = typeof question === 'string';
            if (isGeolocationMedia) {
              questionMediaUrl = `geo:${question}`;
            } else {
              const {
                data: { file_url },
              } = await nexusaiAPI.router.preview.uploadFile({
                projectUuid: this.$store.state.Auth.connectProjectUuid,
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
            projectUuid: this.$store.state.Auth.connectProjectUuid,
            text: isQuestionMedia ? '' : question,
            attachments: questionMediaUrl ? [questionMediaUrl] : [],
            contact_urn: this.preview.contact.urns[0],
          });

          if (data.type === 'broadcast') {
            answer.status = 'loaded';

            const safeParseMessage = attempt(
              JSON.parse.bind(null, data.message),
            );
            const textOfComponents = safeParseMessage?.msg?.text;

            answer.text =
              textOfComponents ||
              get(
                data,
                'message',
                this.$t('quick_test.unable_to_find_an_answer', this.language),
              );

            answer.sources = get(data, 'fonts', []);

            this.scrollToLastMessage();
          } else if (data.type === 'flowstart') {
            this.messages.splice(this.messages.indexOf(answer), 0, {
              type: 'flowstart',
              name: data.name,
              question_uuid: null,
              feedback: {
                value: null,
                reason: null,
              },
            });

            this.flowStart(answer, {
              name: data.name,
              uuid: data.uuid,
              params: data.params,
            });
          } else if (data.type === 'media_and_location_unavailable') {
            answer.status = 'loaded';
            answer.type = data.type;
          } else if (data.type === 'cancelled') {
            answer.status = 'loaded';
            this.messages.splice(index, 1);
          }
        } catch {
          handleError();
        }
      } else {
        try {
          const { data } = await nexusaiAPI.question.create({
            contentBaseUuid: this.contentBaseUuid,
            text: question,
            language: (this.language || '').toLowerCase(),
          });

          answer.status = 'loaded';
          answer.question_uuid = get(data, 'question_uuid', null);
          answer.text = get(
            data,
            'answers.0.text',
            this.$t('quick_test.unable_to_find_an_answer', this.language),
          );

          this.scrollToLastMessage();
        } catch {
          handleError();
        }
      }
    },

    scrollToLastMessage() {
      this.$nextTick(() => {
        this.$refs.messages.lastElementChild.scrollIntoView({
          behavior: 'smooth',
        });
      });
    },
  },
};
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

.quick-test {
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

    &__question,
    &__answer {
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

    &__question {
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

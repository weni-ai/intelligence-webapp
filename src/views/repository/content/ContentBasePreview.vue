<template>
  <div class="quick-test">
    <div class="messages">
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

        <MessageDisplay
          v-for="(message, index) in messages"
          :key="index"
          :message="message"
          :contentBaseUuid="contentBaseUuid"
        />
      </div>
    </div>

    <div class="write-message">
      <MessageInput
        v-model="message"
        class="write-message__message-input"
        :placeholder="$t('webapp.home.bases.tests_placeholder')"
        @send="sendMessage"
      />
    </div>
  </div>
</template>

<script>
import { get } from 'lodash';
import { reactive } from 'vue';

import DotTyping from '@/components/QuickTest/DotTyping.vue';
import MessageDisplay from '@/components/QuickTest/MessageDisplay.vue';
import MessageInput from './MessageInput.vue';

import { getFileType } from '@/utils/medias';

import nexusaiAPI from '@/api/nexusaiAPI';

export default {
  name: 'ContentBasePreview',

  components: {
    MessageDisplay,
    MessageInput,
    DotTyping,
  },

  props: {
    contentBaseUuid: {
      type: String,
      required: true,
    },
    contentBaseLanguage: {
      type: String,
      required: false,
      default: '',
    },
  },

  emits: ['messages'],

  data() {
    return {
      message: '',
      messages: [],
    };
  },

  computed: {
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
  },

  methods: {
    isMedia(message) {
      return !!getFileType(message);
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

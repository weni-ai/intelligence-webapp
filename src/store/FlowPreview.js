import { defineStore } from 'pinia';
import { ref } from 'vue';
import { get, attempt } from 'lodash';

import useFlowPreview from '@/composables/useFlowPreview';

export const useFlowPreviewStore = defineStore('flowPreview', () => {
  const {
    preview,
    previewInit,
    previewStart,
    previewHasQuickReplies,
    previewResume,
  } = useFlowPreview();

  const messages = ref([]);
  const messageInput = ref('');

  function addMessage(message) {
    messages.value.push(message);
  }

  function clearMessages() {
    messages.value = [];
  }

  function setMessageInput(text) {
    messageInput.value = text;
  }

  function replaceMessage(toReplace, newMessages) {
    const index = messages.value.indexOf(toReplace);
    if (index !== -1) {
      messages.value.splice(
        index,
        1,
        ...(Array.isArray(newMessages) ? newMessages : [newMessages]),
      );
    }
  }

  function removeMessage(message) {
    const index = messages.value.indexOf(message);
    if (index !== -1) {
      messages.value.splice(index, 1);
    }
  }

  function treatAnswerResponse(
    answer,
    data,
    {
      onBroadcast,
      onFlowStart,
      onMediaUnavailable,
      onCancelled,
      fallbackMessage = '',
    },
  ) {
    if (data.type === 'broadcast') {
      answer.status = 'loaded';

      answer.response = attempt(
        JSON.parse.bind(null, get(data, 'message', fallbackMessage)),
      );
      answer.sources = get(data, 'fonts', []);

      if (onBroadcast) onBroadcast(answer);
    } else if (data.type === 'flowstart') {
      // Insert a flowstart message before the answer
      const answerIndex = messages.value.indexOf(answer);
      messages.value.splice(answerIndex, 0, {
        type: 'flowstart',
        name: data.name,
        question_uuid: null,
        feedback: {
          value: null,
          reason: null,
        },
      });

      if (onFlowStart) onFlowStart(answer, data);
    } else if (data.type === 'media_and_location_unavailable') {
      answer.status = 'loaded';
      answer.type = data.type;

      if (onMediaUnavailable) onMediaUnavailable(answer);
    } else if (data.type === 'cancelled') {
      answer.status = 'loaded';
      removeMessage(answer);

      if (onCancelled) onCancelled();
    }
  }

  return {
    preview,
    messages,
    messageInput,

    previewInit,
    previewStart,
    previewResume,
    previewHasQuickReplies,

    addMessage,
    clearMessages,
    setMessageInput,
    replaceMessage,
    removeMessage,
    treatAnswerResponse,
  };
});

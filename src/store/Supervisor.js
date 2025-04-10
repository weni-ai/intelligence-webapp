import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import globalStore from '.';

import nexusaiAPI from '@/api/nexusaiAPI';

import { PerformanceAdapter } from '@/api/adapters/supervisor/performance';

export const useSupervisorStore = defineStore('Supervisor', () => {
  const projectUuid = computed(() => globalStore.state.Auth.connectProjectUuid);
  const supervisorApi = nexusaiAPI.agent_builder.supervisor;

  const forwardStats = reactive({
    status: null,
    data: {
      attendedByAgent: 0,
      forwardedHumanSupport: 0,
    },
  });

  const conversations = reactive({
    status: null,
    data: [],
  });

  const selectedConversation = ref(null);

  async function loadForwardStats() {
    forwardStats.status = 'loading';
    try {
      const response = await supervisorApi.conversations.forwardStats({
        projectUuid: projectUuid.value,
        start: '2025-01-01',
        end: '2025-05-01',
      });

      forwardStats.status = 'complete';
      forwardStats.data = PerformanceAdapter.fromApi(response);
    } catch (error) {
      forwardStats.status = 'error';
    }
  }

  async function loadConversations() {
    conversations.status = 'loading';
    try {
      const response = await supervisorApi.conversations.list({
        projectUuid: projectUuid.value,
        start: '2025-01-01',
        end: '2025-05-01',
      });

      conversations.status = 'complete';
      conversations.data = response;
    } catch (error) {
      conversations.status = 'error';
    }
  }

  function selectConversation(conversationId) {
    selectedConversation.value = conversationId;
  }

  return {
    forwardStats,
    loadForwardStats,
    conversations,
    loadConversations,
    selectConversation,
    selectedConversation,
  };
});

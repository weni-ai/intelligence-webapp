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

  const filters = reactive({
    start: '',
    end: '',
    search: '',
    type: '',
  });

  async function loadForwardStats() {
    forwardStats.status = 'loading';
    try {
      const response = await supervisorApi.conversations.forwardStats({
        projectUuid: projectUuid.value,
        start: '2025-01-01',
        end: '2025-05-01',
      });

      const adaptedData = PerformanceAdapter.fromApi(response);
      const total =
        adaptedData.attendedByAgent + adaptedData.forwardedHumanSupport;

      const calculatePercentage = (value) =>
        total === 0 ? 0 : Math.round((value / total) * 100);

      forwardStats.data = {
        attendedByAgent: calculatePercentage(adaptedData.attendedByAgent),
        forwardedHumanSupport: calculatePercentage(
          adaptedData.forwardedHumanSupport,
        ),
      };

      forwardStats.status = 'complete';
    } catch (error) {
      forwardStats.status = 'error';
    }
  }

  async function loadConversations() {
    conversations.status = 'loading';
    try {
      const response = await supervisorApi.conversations.list({
        projectUuid: projectUuid.value,
        start: filters.start,
        end: filters.end,
        search: filters.search,
      });

      conversations.status = 'complete';
      conversations.data = response;
    } catch (error) {
      conversations.status = 'error';
    }
  }

  async function loadSelectedConversationData() {
    try {
      selectedConversation.value.data.status = 'loading';
      const response = await supervisorApi.conversations.getById({
        projectUuid: projectUuid.value,
        conversationId: selectedConversation.value.id,
      });

      selectedConversation.value.data = {
        ...selectedConversation.value.data,
        ...response,
      };

      selectedConversation.value.data.status = 'complete';
    } catch (error) {
      console.error(error);

      selectedConversation.value.data.status = 'error';
    }
  }

  function selectConversation(conversationId) {
    if (!conversationId) {
      selectedConversation.value = null;
      return;
    }

    const conversation = conversations.data.results.find(
      (conversation) => conversation.id === conversationId,
    );

    selectedConversation.value = {
      ...conversation,
      data: {
        status: null,
      },
    };
  }

  return {
    forwardStats,
    loadForwardStats,
    conversations,
    loadConversations,
    loadSelectedConversationData,
    selectConversation,
    selectedConversation,
    filters,
  };
});

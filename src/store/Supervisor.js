import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
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

  return {
    forwardStats,
    loadForwardStats,
    conversations,
    loadConversations,
  };
});

import { defineStore } from 'pinia';
import { reactive } from 'vue';

import nexusaiAPI from '@/api/nexusaiAPI.js';

export const useAgentsTeamStore = defineStore('agents-team', () => {
  const officialAgents = reactive({
    status: null,
    data: [],
    next: 0,
  });

  async function loadOfficialAgents({ search = '' } = {}) {
    try {
      officialAgents.status = 'loading';

      const { data, next } =
        await nexusaiAPI.router.agents_team.listOfficialAgents({
          search,
        });

      officialAgents.data = data;
      officialAgents.next = next;
      officialAgents.status = 'complete';
    } catch (error) {
      console.error('error', error);

      officialAgents.status = 'error';
    }
  }

  async function toggleAgentAssignment({ uuid, is_assigned }) {
    if (!uuid || typeof is_assigned !== 'boolean') {
      throw new Error('uuid and is_assigned are required');
    }

    try {
      const { data } =
        await nexusaiAPI.router.agents_team.toggleAgentAssignment({
          agentUuid: uuid,
          is_assigned,
        });

      const agent = officialAgents.data.find((agent) => agent.uuid === uuid);
      agent.assigned = data.assigned;
    } catch (error) {
      console.error('error', error);
    }
  }

  return {
    officialAgents,
    loadOfficialAgents,
    toggleAgentAssignment,
  };
});

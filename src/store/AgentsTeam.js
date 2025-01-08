import { defineStore } from 'pinia';
import { reactive } from 'vue';

import nexusaiAPI from '@/api/nexusaiAPI.js';

export const useAgentsTeamStore = defineStore('AgentsTeam', () => {
  const activeTeam = reactive({
    status: null,
    data: [],
  });

  const officialAgents = reactive({
    status: null,
    data: [],
  });

  const myAgents = reactive({
    status: null,
    data: [],
  });

  async function loadActiveTeam() {
    try {
      activeTeam.status = 'loading';

      const { data } = await nexusaiAPI.router.agents_team.listActiveTeam();

      activeTeam.data = data;
      activeTeam.status = 'complete';
    } catch (error) {
      console.error('error', error);

      activeTeam.status = 'error';
    }
  }

  async function loadOfficialAgents({ search = '' } = {}) {
    try {
      officialAgents.status = 'loading';

      const { data } = await nexusaiAPI.router.agents_team.listOfficialAgents({
        search,
      });

      officialAgents.data = data;
      officialAgents.status = 'complete';
    } catch (error) {
      console.error('error', error);

      officialAgents.status = 'error';
    }
  }

  async function loadMyAgents({ search = '' } = {}) {
    try {
      myAgents.status = 'loading';

      const { data } = await nexusaiAPI.router.agents_team.listMyAgents({
        search,
      });

      myAgents.data = data;
      myAgents.status = 'complete';
    } catch (error) {
      console.error('error', error);

      myAgents.status = 'error';
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

      const agent =
        officialAgents.data.find((agent) => agent.uuid === uuid) ||
        myAgents.data.find((agent) => agent.uuid === uuid);

      if (agent) {
        agent.assigned = data.assigned;
      }
    } catch (error) {
      console.error('error', error);
    }
  }

  return {
    activeTeam,
    officialAgents,
    myAgents,
    loadActiveTeam,
    loadOfficialAgents,
    loadMyAgents,
    toggleAgentAssignment,
  };
});

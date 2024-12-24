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
      console.log('error', error);

      officialAgents.status = 'error';
    }
  }

  return {
    officialAgents,
    loadOfficialAgents,
  };
});

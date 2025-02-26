import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';

import nexusaiAPI from '@/api/nexusaiAPI.js';
import { useAlertStore } from './Alert';

import i18n from '@/utils/plugins/i18n';

export const useAgentsTeamStore = defineStore('AgentsTeam', () => {
  const linkToCreateAgent = 'https://github.com/weni-ai/weni-cli';

  const alertStore = useAlertStore();

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

  const isAgentsGalleryOpen = ref(false);

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

  async function toggleAgentAssignment({ external_id, is_assigned }) {
    if (!external_id || typeof is_assigned !== 'boolean') {
      throw new Error('external_id and is_assigned are required');
    }

    try {
      const agent =
        officialAgents.data.find(
          (agent) => agent.external_id === external_id,
        ) || myAgents.data.find((agent) => agent.external_id === external_id);

      const { data } =
        await nexusaiAPI.router.agents_team.toggleAgentAssignment({
          agentUuid: agent.uuid,
          is_assigned,
        });

      if (agent) {
        agent.assigned = data.assigned;

        if (is_assigned) {
          activeTeam.data.agents.push(agent);
        } else {
          activeTeam.data.agents = activeTeam.data.agents.filter(
            (agent) => agent.external_id !== external_id,
          );
        }

        alertStore.add({
          text: i18n.global.t(
            is_assigned
              ? 'router.agents_team.card.success_assign_alert'
              : 'router.agents_team.card.success_unassign_alert',
            {
              agent: agent.name,
            },
          ),
          type: 'success',
        });
      }

      return {
        status: 'success',
      };
    } catch (error) {
      console.error('error', error);

      return {
        status: 'error',
      };
    }
  }

  return {
    linkToCreateAgent,
    activeTeam,
    officialAgents,
    myAgents,
    isAgentsGalleryOpen,
    loadActiveTeam,
    loadOfficialAgents,
    loadMyAgents,
    toggleAgentAssignment,
  };
});

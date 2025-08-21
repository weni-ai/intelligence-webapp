import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

import nexusaiAPI from '@/api/nexusaiAPI.js';
import { useAlertStore } from './Alert';
import agentIconService from '@/utils/agentIconService';

import i18n from '@/utils/plugins/i18n';

export const useAgentsTeamStore = defineStore('AgentsTeam', () => {
  const linkToCreateAgent = 'https://github.com/weni-ai/weni-cli';

  const alertStore = useAlertStore();

  const activeTeam = reactive({
    status: null,
    data: {
      manager: null,
      agents: [],
    },
  });

  const officialAgents = reactive({
    status: null,
    data: [],
  });

  const myAgents = reactive({
    status: null,
    data: [],
  });

  const allAgents = computed(() => {
    return {
      manager: activeTeam.data.manager,
      agents: [...officialAgents.data, ...myAgents.data],
    };
  });

  const isAgentsGalleryOpen = ref(false);

  async function loadActiveTeam() {
    try {
      activeTeam.status = 'loading';

      const { data } = await nexusaiAPI.router.agents_team.listActiveTeam();

      activeTeam.data = {
        manager: data.manager,
        agents: agentIconService.applyIconsToAgents(data.agents),
      };
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

      officialAgents.data = agentIconService.applyIconsToAgents(data);
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

      myAgents.data = agentIconService.applyIconsToAgents(data);
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
      const agent =
        officialAgents.data.find((agent) => agent.uuid === uuid) ||
        myAgents.data.find((agent) => agent.uuid === uuid);

      if (!agent) {
        throw new Error('Agent not found');
      }

      const { data } =
        await nexusaiAPI.router.agents_team.toggleAgentAssignment({
          agentUuid: agent?.uuid,
          is_assigned,
        });

      agent.assigned = data.assigned;

      if (is_assigned) {
        activeTeam.data.agents.push(agent);
      } else {
        activeTeam.data.agents = activeTeam.data.agents.filter(
          (agent) => agent.uuid !== uuid,
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

      return {
        status: 'success',
      };
    } catch (error) {
      console.error('error', error);

      alertStore.add({
        text: i18n.global.t('router.agents_team.card.error_alert'),
        type: 'error',
      });

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
    allAgents,
    isAgentsGalleryOpen,
    loadActiveTeam,
    loadOfficialAgents,
    loadMyAgents,
    toggleAgentAssignment,
  };
});

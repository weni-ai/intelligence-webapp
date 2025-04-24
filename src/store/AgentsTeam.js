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

  const agentIconService = (() => {
    const officialIcons = {
      Order: 'OrdersAgent',
    };

    const customIcons = Array.from(
      { length: 24 },
      (_, index) => `CustomIcon${index + 1}`,
    );

    const iconAssignments = new Map();
    let nextCustomIconIndex = 0;

    return {
      getIconForAgent(agent) {
        const { name, uuid } = agent;

        const matchedOfficialIcon = Object.keys(officialIcons).find((key) =>
          name.includes(key),
        );

        if (matchedOfficialIcon) {
          return officialIcons[matchedOfficialIcon];
        }

        if (iconAssignments.has(uuid)) {
          return iconAssignments.get(uuid);
        }

        const icon = customIcons[nextCustomIconIndex];
        nextCustomIconIndex = (nextCustomIconIndex + 1) % customIcons.length;
        iconAssignments.set(uuid, icon);

        return icon;
      },

      applyIconToAgent(agent) {
        return {
          ...agent,
          icon: this.getIconForAgent(agent),
        };
      },
    };
  })();

  async function loadActiveTeam() {
    try {
      activeTeam.status = 'loading';

      const { data } = await nexusaiAPI.router.agents_team.listActiveTeam();

      activeTeam.data = {
        manager: data.manager,
        agents:
          data.agents?.map((agent) =>
            agentIconService.applyIconToAgent(agent),
          ) || [],
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

      officialAgents.data =
        data?.map((agent) => agentIconService.applyIconToAgent(agent)) || [];
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

      myAgents.data =
        data?.map((agent) => agentIconService.applyIconToAgent(agent)) || [];
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
    isAgentsGalleryOpen,
    loadActiveTeam,
    loadOfficialAgents,
    loadMyAgents,
    toggleAgentAssignment,
  };
});

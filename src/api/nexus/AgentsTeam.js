import { computed } from 'vue';
import request from '@/api/nexusaiRequest';
import { useProjectStore } from '@/store/Project';
import { cleanParams } from '@/utils/http';

const projectUuid = computed(() => useProjectStore().uuid);

export const AgentsTeam = {
  async listOfficialAgents({ search }) {
    const params = cleanParams({
      search,
    });
    const { data } = await request.$http.get(
      `api/agents/official/${projectUuid.value}`,
      {
        params,
      },
    );

    return {
      data: data.map(
        ({
          uuid,
          name,
          description,
          skills,
          assigned,
          credentials,
          is_official,
          slug,
        }) => ({
          uuid,
          name,
          description,
          skills,
          assigned,
          credentials,
          is_official,
          id: slug,
        }),
      ),
    };
  },

  async listMyAgents({ search }) {
    const params = cleanParams({
      search,
    });
    const { data } = await request.$http.get(
      `api/agents/my-agents/${projectUuid.value}`,
      {
        params,
      },
    );

    return {
      data: data.map(
        ({
          uuid,
          name,
          description,
          skills,
          assigned,
          credentials,
          is_official,
          slug,
        }) => ({
          uuid,
          name,
          description,
          skills,
          assigned,
          credentials,
          is_official,
          id: slug,
        }),
      ),
    };
  },

  async listActiveTeam() {
    const { data } = await request.$http.get(
      `api/agents/teams/${projectUuid.value}`,
    );

    const { manager, agents } = data;

    return {
      data: {
        manager: {
          id: manager.id || 'manager',
        },
        agents: agents.map(
          ({
            uuid,
            name,
            skills,
            id,
            description,
            credentials,
            is_official,
          }) => ({
            uuid,
            name,
            skills,
            id,
            description,
            credentials,
            is_official,
          }),
        ),
      },
    };
  },

  async toggleAgentAssignment({ agentUuid, is_assigned }) {
    const { data } = await request.$http.patch(
      `api/project/${projectUuid.value}/assign/${agentUuid}`,
      {
        assigned: is_assigned,
      },
      {
        hideGenericErrorAlert: true,
      },
    );

    return {
      data,
    };
  },
};

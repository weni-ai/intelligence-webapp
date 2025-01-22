import { computed } from 'vue';

import request from '@/api/nexusaiRequest';
import globalStore from '@/store';
import { cleanParams } from '@/utils/http';

const connectProjectUuid = computed(
  () => globalStore.state.Auth.connectProjectUuid,
);

export const AgentsTeam = {
  async listOfficialAgents({ search }) {
    const params = cleanParams({
      search,
    });
    const { data } = await request.$http.get(
      `api/agents/official/${connectProjectUuid.value}`,
      {
        params,
      },
    );

    return {
      data: data.map(({ uuid, name, description, skills, assigned }) => ({
        uuid,
        name,
        description,
        skills,
        assigned,
      })),
    };
  },

  async listMyAgents({ search }) {
    const params = cleanParams({
      search,
    });
    const { data } = await request.$http.get(
      `api/agents/my-agents/${connectProjectUuid.value}`,
      {
        params,
      },
    );

    return {
      data: data.map(({ uuid, name, description, skills, assigned }) => ({
        uuid,
        name,
        description,
        skills,
        assigned,
      })),
    };
  },

  async listActiveTeam() {
    const { data } = await request.$http.get(
      `api/agents/teams/${connectProjectUuid.value}`,
    );

    return {
      data: data.map(({ uuid, name, skills }) => ({
        uuid,
        name,
        skills,
      })),
    };
  },

  async toggleAgentAssignment({ agentUuid, is_assigned }) {
    const { data } = await request.$http.patch(
      `api/project/${connectProjectUuid.value}/assign/${agentUuid}`,
      {
        assigned: is_assigned,
      },
    );

    return {
      data,
    };
  },
};
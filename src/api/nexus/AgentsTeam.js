import { computed } from 'vue';

import request from '@/api/nexusaiRequest';
import globalStore from '@/store';
import { cleanParams } from '@/utils/http';

const officialAgentsMock = [
  {
    uuid: '66bda93c-0bab-4a47-967e-5719e9e792e3',
    name: 'Order Analyst',
    description:
      'Handles customer requests related to orders, including tracking, changes, and cancellations',
    skills: [
      { name: 'Get order', icon: '🛒' },
      { name: 'Cancel order', icon: '🛒' },
      { name: 'UPS order tracking', icon: '📈' },
    ],
    assigned: true,
  },
  {
    uuid: '776004f3-c784-4762-85f4-a93ca329a7f7',
    name: 'Credit card agent',
    description:
      'Manages credit card services, such as issuing cards, cancellations, and checking balances',
    skills: [
      { name: 'Issue credit card', icon: '💳' },
      { name: 'Cancel credit card', icon: '❌' },
      { name: 'Check balance', icon: '💰' },
    ],
    assigned: true,
  },
  {
    uuid: '22687b66-8da9-49df-be5e-191a4f4f3a3a',
    name: 'Tracking agent',
    description:
      'Assists customers with product tracking and streamlines the checkout process',
    skills: [
      { name: 'Search catalogue', icon: '🛒' },
      { name: 'Checkout', icon: '🛒' },
    ],
    assigned: true,
  },
  {
    uuid: '6b1197bf-3b7b-4a9d-b713-7b67aafe4b60',
    name: 'Substitution Analyst',
    description:
      'Processes substitution or replacement requests for customer orders efficiently',
    skills: [{ name: 'Register change order', icon: '🛒' }],
    assigned: false,
  },
  {
    uuid: '0b1197bf-3b7b-4a9d-b713-7b67aafe4b60',
    name: 'Rewards Analyst',
    description:
      'Handles rewards program inquiries, including registering and managing referral points',
    skills: [{ name: 'Register Referral point', icon: '🎁' }],
    assigned: false,
  },
  {
    uuid: '6955d912-2c3c-4c1e-9bc4-599d9273fb22',
    name: 'Return Analyst',
    description:
      'Manages product return requests and facilitates refund payments for customers',
    skills: [{ name: 'Refund payment', icon: '🛒' }],
    assigned: false,
  },
];

const mockPromise = () => new Promise((resolve) => setTimeout(resolve, 1000));

const connectProjectUuid = computed(
  () => globalStore.state.Auth.connectProjectUuid,
);

export const AgentsTeam = {
  async listOfficialAgents({ search }) {
    // const params = cleanParams({
    //   search,
    // });
    // const { data } = await request.$http.get(`api/agents/official`, {
    //   params,
    // });

    return mockPromise().then(() => ({
      data: officialAgentsMock.map(
        ({ uuid, name, description, skills, assigned }) => ({
          uuid,
          name,
          description,
          skills,
          assigned,
        }),
      ),
    }));
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

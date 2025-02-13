import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import { createTestingPinia } from '@pinia/testing';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

import i18n from '@/utils/plugins/i18n';

import ActiveTeam from '@/views/Brain/RouterAgentsTeam/ActiveTeam.vue';

const pinia = createTestingPinia({
  initialState: {
    AgentsTeam: {
      activeTeam: {
        status: null,
        data: [],
      },
      officialAgents: {
        status: null,
        data: [],
      },
      myAgents: {
        status: null,
        data: [],
      },
    },
  },
});

describe('ActiveTeam component', () => {
  let wrapper;
  const agentsTeamStore = useAgentsTeamStore();

  beforeEach(() => {
    wrapper = mount(ActiveTeam, {
      global: {
        plugins: [pinia],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should match snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders the title', () => {
    const title = wrapper.find('[data-testid="title"]');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(
      i18n.global.t('router.agents_team.active_team.title'),
    );
  });

  // TODO: Fix this test

  // it('renders the loading state', async () => {
  //   agentsTeamStore.activeTeam.status = 'loading';
  //   agentsTeamStore.activeTeam.data.agents = [];

  //   await nextTick();

  //   const loadingCards = wrapper.findAllComponents(
  //     '[data-testid="loading-card"]',
  //   );
  //   expect(loadingCards.length).toBe(3);
  // });

  // it('renders the active team cards', async () => {
  //   const agents = [
  //     {
  //       uuid: 'uuid-1',
  //       name: 'Agent 1',
  //       description: 'Description 1',
  //       skills: [{ name: 'Skill 1', icon: '🛒' }],
  //     },
  //   ];
  //   agentsTeamStore.activeTeam.data.agents = agents;
  //   agentsTeamStore.activeTeam.status = 'complete';

  //   await nextTick();

  //   const teamCards = wrapper.findAllComponents('[data-testid="team-card"]');
  //   expect(teamCards.length).toBe(agents.length);
  // });

  it('renders the empty state', async () => {
    agentsTeamStore.activeTeam.status = 'complete';
    agentsTeamStore.activeTeam.data.agents = [];

    await nextTick();

    const emptyState = wrapper.find('[data-testid="empty-state"]');
    expect(emptyState.exists()).toBe(true);
  });

  it('should load active team when mounted', async () => {
    expect(agentsTeamStore.loadActiveTeam).toHaveBeenCalledTimes(1);
  });
});

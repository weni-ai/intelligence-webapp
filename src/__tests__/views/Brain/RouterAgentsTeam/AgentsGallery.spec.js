import { afterEach, beforeEach, expect } from 'vitest';
import { nextTick } from 'vue';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AgentsGallery from '@/views/Brain/RouterAgentsTeam/AgentsGallery.vue';

const pinia = createTestingPinia({
  initialState: {
    AgentsTeam: {
      officialAgents: {
        status: null,
        data: [
          {
            uuid: 'uuid-1',
            name: 'Agent 1',
            description: 'Description 1',
            skills: [{ name: 'Skill 1', icon: '🛒' }],
          },
          {
            uuid: 'uuid-2',
            name: 'Agent 2',
            description: 'Description 2',
            skills: [{ name: 'Skill 2', icon: '🛒' }],
          },
        ],
      },
      myAgents: {
        status: null,
        data: [
          {
            uuid: 'uuid-3',
            name: 'My Agent 1',
            description: 'My Description 1',
            skills: [{ name: 'Skill 3', icon: '🛒' }],
          },
          {
            uuid: 'uuid-4',
            name: 'My Agent 2',
            description: 'My Description 2',
            skills: [{ name: 'Skill 4', icon: '🛒' }],
          },
        ],
      },
    },
  },
});

describe('AgentsGallery.vue', () => {
  let wrapper;
  const agentsTeamStore = useAgentsTeamStore();

  beforeEach(() => {
    wrapper = shallowMount(AgentsGallery, {
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

  it('should renders the component', () => {
    expect(wrapper.find('[data-testid="agents-gallery"]').exists()).toBe(true);
  });

  it('should renders the tabs', () => {
    const tabs = wrapper.findComponent('[data-testid="agents-gallery-tabs"]');

    expect(tabs.props('tabs').length).toBe(2);
    expect(tabs.props('activeTab')).toBe('official');
  });

  it('should renders the search input', () => {
    const searchInput = wrapper.find('[data-testid="search-input"]');
    expect(searchInput.exists()).toBe(true);
  });

  it('should renders the agent cards', () => {
    const agentCards = wrapper.findAllComponents('[data-testid="agent-card"]');

    expect(agentCards.length).toBe(2);
  });

  it('should renders the loading state', async () => {
    agentsTeamStore.officialAgents.status = 'loading';
    await nextTick();

    const loadingCards = wrapper.findAll('[data-testid="agent-card-loading"]');
    expect(loadingCards.length).toBe(3);
  });

  it('should change the data when tab changes', async () => {
    expect(wrapper.vm.agentsData).toBe(agentsTeamStore.officialAgents.data);

    wrapper.vm.activeTab = 'my-agents';
    await nextTick();

    expect(wrapper.vm.agentsData).toBe(agentsTeamStore.myAgents.data);
  });

  it('should load my agents when tab changes if not loaded', async () => {
    agentsTeamStore.myAgents.status = null;
    wrapper.vm.onTabChange('my-agents');
    await nextTick();

    expect(agentsTeamStore.loadMyAgents).toHaveBeenCalledTimes(1);
    agentsTeamStore.myAgents.status = 'complete';

    wrapper.vm.onTabChange('official');
    wrapper.vm.onTabChange('my-agents');
    await nextTick();

    expect(agentsTeamStore.loadMyAgents).toHaveBeenCalledTimes(1);
  });

  it('should search agents when search input changes', async () => {
    vi.useFakeTimers();

    vi.clearAllMocks();
    wrapper.vm.search['official'] = 'Test Search';
    await vi.runAllTimers();

    expect(agentsTeamStore.loadOfficialAgents).toHaveBeenCalledTimes(1);

    wrapper.vm.search['my-agents'] = 'Test Search';
    await vi.runAllTimers();
    expect(agentsTeamStore.loadMyAgents).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});

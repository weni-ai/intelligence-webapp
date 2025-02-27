import { afterEach, beforeEach, expect } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AgentsGalleryModal from '@/views/Brain/RouterAgentsTeam/AgentsGalleryModal.vue';

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
    wrapper = mount(AgentsGalleryModal, {
      global: {
        plugins: [pinia],
      },
      props: {
        modelValue: true,
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

  it('should renders the sidebar menu with the correct tabs', () => {
    const sidebarMenu = wrapper.findComponent('[data-testid="sidebar-menu"]');
    const sidebarItems = wrapper.findAllComponents(
      '[data-testid="sidebar-item"]',
    );

    expect(sidebarMenu.exists()).toBe(true);
    expect(sidebarItems.length).toBe(2);
    expect(sidebarItems[0].props('active')).toBe(true);
    expect(sidebarItems[1].props('active')).toBe(false);
  });

  it('should renders the search input', () => {
    const searchInput = wrapper.find('[data-testid="search-input"]');
    expect(searchInput.exists()).toBe(true);
  });

  it('should renders the agent cards', () => {
    const agentCards = wrapper.findAll('[data-testid="assign-agent-card"]');

    expect(agentCards.length).toBe(2);
  });

  it('should renders the loading state', async () => {
    agentsTeamStore.officialAgents.status = 'loading';
    await nextTick();

    const loadingCards = wrapper.findAll(
      '[data-testid="assign-agent-card-skeleton"]',
    );
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

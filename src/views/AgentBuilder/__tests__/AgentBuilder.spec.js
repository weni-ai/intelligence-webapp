import { createStore } from 'vuex';
import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { useTuningsStore } from '@/store/Tunings';
import { useAgentsTeamStore } from '@/store/AgentsTeam';
import { useProfileStore } from '@/store/Profile';

import AgentBuilder from '@/views/AgentBuilder/index.vue';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    name: 'supervisor',
  })),
}));

const store = createStore({
  state() {
    return {
      Brain: {
        tabsWithError: null,
      },
    };
  },
});

describe('AgentBuilder.vue', () => {
  let wrapper;
  let tuningsStore;
  let agentsTeamStore;
  let profileStore;

  const sidebar = () =>
    wrapper.findComponent('[data-testid="agent-builder-sidebar"]');
  const content = () => wrapper.find('[data-testid="agent-builder-content"]');
  const currentView = () =>
    wrapper.findComponent('[data-testid="agent-builder-content-view"]');
  const modalSaveChangesError = () =>
    wrapper.findComponent(
      '[data-testid="agent-builder-modal-save-changes-error"]',
    );

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });

    wrapper = shallowMount(AgentBuilder, {
      global: {
        plugins: [pinia, store],
      },
    });

    tuningsStore = useTuningsStore();
    agentsTeamStore = useAgentsTeamStore();
    profileStore = useProfileStore();
  });

  describe('Component rendering', () => {
    it('renders correctly', () => {
      expect(sidebar().exists()).toBe(true);
      expect(content().exists()).toBe(true);
    });

    it('renders the correct view based on route name', () => {
      expect(currentView().exists()).toBe(true);
      expect(wrapper.html()).toContain('supervisor-stub');
    });

    it('does not render modal when tabsWithError is null', () => {
      expect(modalSaveChangesError().exists()).toBe(false);
    });

    it('renders modal when tabsWithError is not null', async () => {
      wrapper.vm.$store.state.Brain.tabsWithError = { message: 'Error' };
      await wrapper.vm.$nextTick();

      expect(modalSaveChangesError().exists()).toBe(true);
    });
  });

  describe('Component lifecycle', () => {
    it('fetches credentials and loads active team on mount', () => {
      expect(tuningsStore.fetchCredentials).toHaveBeenCalled();
      expect(agentsTeamStore.loadActiveTeam).toHaveBeenCalled();
    });
  });
});

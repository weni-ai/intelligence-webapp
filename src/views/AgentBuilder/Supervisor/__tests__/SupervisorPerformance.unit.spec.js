import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import SupervisorPerformance from '../SupervisorPerformance.vue';
import { useSupervisorStore } from '@/store/Supervisor';

describe('SupervisorPerformance.vue', () => {
  let wrapper;
  let supervisorStore;

  const createWrapper = (initialState = {}) => {
    const pinia = createTestingPinia({
      initialState: {
        Supervisor: {
          forwardStats: {
            status: 'complete',
            data: {
              attendedByAgent: 75,
              forwardedHumanSupport: 25,
            },
            ...initialState.forwardStats,
          },
          filters: {
            start: '',
            end: '',
            search: '',
            type: '',
            ...initialState.filters,
          },
        },
      },
      stubActions: false,
    });

    supervisorStore = useSupervisorStore(pinia);
    supervisorStore.loadForwardStats = vi.fn();

    return mount(SupervisorPerformance, {
      global: {
        plugins: [pinia],
      },
    });
  };

  const performanceCards = () =>
    wrapper.findAllComponents('[data-testid="performance-card"]');

  beforeEach(() => {
    wrapper = createWrapper();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Elements', () => {
    it('renders PerformanceCard components for each stat', () => {
      expect(performanceCards().length).toBe(2);
    });

    it('passes correct props to PerformanceCard components', () => {
      const cards = performanceCards();
      const t = (key) => wrapper.vm.$t(key);

      const attendedByAgentCard = cards.find(
        (card) => card.props('scheme') === 'green',
      );
      expect(attendedByAgentCard.exists()).toBe(true);
      expect(attendedByAgentCard.props('title')).toBe(
        t('agent_builder.supervisor.attended_by_agent.title'),
      );
      expect(attendedByAgentCard.props('tooltip')).toBe(
        t('agent_builder.supervisor.attended_by_agent.tooltip'),
      );
      expect(attendedByAgentCard.props('value')).toBe(75);
      expect(attendedByAgentCard.props('isLoading')).toBe(false);

      const forwardedHumanSupportCard = cards.find(
        (card) => card.props('scheme') === 'blue',
      );
      expect(forwardedHumanSupportCard.exists()).toBe(true);
      expect(forwardedHumanSupportCard.props('title')).toBe(
        t('agent_builder.supervisor.forwarded_human_support.title'),
      );
      expect(forwardedHumanSupportCard.props('tooltip')).toBe(
        t('agent_builder.supervisor.forwarded_human_support.tooltip'),
      );
      expect(forwardedHumanSupportCard.props('value')).toBe(25);
      expect(forwardedHumanSupportCard.props('isLoading')).toBe(false);
    });
  });

  describe('Loading State', () => {
    it('passes isLoading prop to PerformanceCard components when loading', async () => {
      supervisorStore.forwardStats.status = 'loading';
      await nextTick();

      const cards = performanceCards();
      cards.forEach((card) => {
        expect(card.props('isLoading')).toBe(true);
      });
    });

    it('passes isLoading=false to PerformanceCard components when data is loaded', async () => {
      supervisorStore.forwardStats.status = 'complete';
      await nextTick();

      const cards = performanceCards();
      cards.forEach((card) => {
        expect(card.props('isLoading')).toBe(false);
      });
    });

    it('handles error state correctly', async () => {
      supervisorStore.forwardStats.status = 'error';
      supervisorStore.forwardStats.data = {
        attendedByAgent: 0,
        forwardedHumanSupport: 0,
      };
      await nextTick();

      const cards = performanceCards();
      cards.forEach((card) => {
        expect(card.props('isLoading')).toBe(false);
        expect(card.props('value')).toBe(0);
      });
    });
  });

  describe('Data Fetching', () => {
    it('calls loadForwardStats on component mount', () => {
      expect(supervisorStore.loadForwardStats).toHaveBeenCalledTimes(1);
    });
  });

  describe('Card Click Handling', () => {
    it('sets filter type when no filter is currently set', async () => {
      supervisorStore.filters.type = '';

      const cards = performanceCards();
      const attendedByAgentCard = cards.find(
        (card) => card.props('scheme') === 'green',
      );

      await attendedByAgentCard.trigger('click');

      expect(supervisorStore.filters.type).toBe('attended_by_agent');
    });

    it('sets filter type when a different filter is currently set', async () => {
      supervisorStore.filters.type = 'attended_by_agent';

      const cards = performanceCards();
      const forwardedHumanSupportCard = cards.find(
        (card) => card.props('scheme') === 'blue',
      );

      await forwardedHumanSupportCard.trigger('click');

      expect(supervisorStore.filters.type).toBe('forwarded_human_support');
    });

    it('clears filter type when the same filter is clicked again', async () => {
      supervisorStore.filters.type = 'attended_by_agent';

      const cards = performanceCards();
      const attendedByAgentCard = cards.find(
        (card) => card.props('scheme') === 'green',
      );

      await attendedByAgentCard.trigger('click');

      expect(supervisorStore.filters.type).toBeNull();
    });

    it('updates clicked prop correctly based on current filter', async () => {
      supervisorStore.filters.type = 'attended_by_agent';
      await nextTick();

      const cards = performanceCards();
      const attendedByAgentCard = cards.find(
        (card) => card.props('scheme') === 'green',
      );
      const forwardedHumanSupportCard = cards.find(
        (card) => card.props('scheme') === 'blue',
      );

      expect(attendedByAgentCard.props('clicked')).toBe(true);
      expect(forwardedHumanSupportCard.props('clicked')).toBe(false);
    });
  });
});

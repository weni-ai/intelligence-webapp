import { flushPromises, mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useMonitoringStore } from '@/store/Monitoring';
import i18n from '@/utils/plugins/i18n';
import RouterMonitoringPerformance from '@/views/Brain/RouterMonitoring/RouterMonitoringPerformance.vue';
import PerformanceCard from '@/components/Brain/Monitoring/PerformanceCard.vue';
import { createTestingPinia } from '@pinia/testing';

const routes = [
  { path: '/monitoring', name: 'router-monitoring', component: {} },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createTestingPinia({
  initialState: {
    monitoring: {
      messages: {
        performance: {
          status: 'loaded',
          action: 5.7,
          success: 75.3,
          failed: 20,
        },
      },
    },
  },
});

describe('RouterMonitoringPerformance.vue', () => {
  let wrapper;
  const monitoringStore = useMonitoringStore();

  const performanceCards = () =>
    wrapper.findAllComponents('[data-test="monitoring-performance-card"]');

  beforeEach(async () => {
    wrapper = mount(RouterMonitoringPerformance, {
      global: { plugins: [pinia, router] },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Elements', () => {
    it('renders the title correctly', () => {
      const title = wrapper.find('[data-test="title"]');
      expect(title.exists()).toBe(true);
      expect(title.text()).toBe(i18n.global.t('router.monitoring.performance'));
    });

    it('renders PerformanceCard components for each answer type', () => {
      expect(performanceCards().length).toBe(3); // success, failed, action
    });

    it('passes correct props to PerformanceCard components', () => {
      const cards = performanceCards();

      const successCard = cards.find(
        (card) => card.props('scheme') === 'green',
      );
      expect(successCard.exists()).toBe(true);
      expect(successCard.props('title')).toBe(
        i18n.global.t('router.monitoring.success.title', { count: 2 }),
      );
      expect(successCard.props('tooltip')).toBe(
        i18n.global.t('router.monitoring.success.tooltip'),
      );
      expect(successCard.props('value')).toBe(75.3);
      expect(successCard.props('isLoading')).toBe(false);

      const failedCard = cards.find((card) => card.props('scheme') === 'red');
      expect(failedCard.exists()).toBe(true);
      expect(failedCard.props('value')).toBe(20);

      const actionCard = cards.find((card) => card.props('scheme') === 'blue');
      expect(actionCard.exists()).toBe(true);
      expect(actionCard.props('value')).toBe(5.7);
    });
  });

  describe('Loading State', () => {
    it('passes isLoading prop to PerformanceCard components when loading', async () => {
      monitoringStore.messages.performance.status = 'loading';
      await nextTick();

      const cards = performanceCards();
      cards.forEach((card) => {
        expect(card.props('isLoading')).toBe(true);
      });
    });

    it('passes isLoading=false to PerformanceCard components when data is loaded', async () => {
      monitoringStore.messages.performance.status = 'loaded';
      await nextTick();

      const cards = performanceCards();
      cards.forEach((card) => {
        expect(card.props('isLoading')).toBe(false);
      });
    });
  });

  describe('Data Fetching', () => {
    it('calls loadMessagesPerformance on component mount', () => {
      expect(monitoringStore.loadMessagesPerformance).toHaveBeenCalledTimes(1);
    });

    it('re-fetches data when route query changes', async () => {
      router.replace({
        path: '/monitoring',
        query: { started_day: '2000-01-01' },
      });
      await flushPromises();
      expect(monitoringStore.loadMessagesPerformance).toHaveBeenCalled();
    });
  });
});

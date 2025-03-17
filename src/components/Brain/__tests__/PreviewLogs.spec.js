import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';

import PreviewLogs from '../PreviewLogs.vue';

import { usePreviewStore } from '@/store/Preview';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

const mockTeam = {
  agents: [
    { external_id: 'agent-1', name: 'Test Agent 1' },
    { external_id: 'agent-2', name: 'Test Agent 2' },
  ],
  manager: { external_id: 'manager-1', name: 'Manager' },
};

const mockTraces = [
  {
    type: 'trace_update',
    trace: {
      summary: 'First trace summary',
      trace: {
        agentId: 'agent-1',
      },
    },
  },
  {
    type: 'trace_update',
    trace: {
      summary: 'Second trace summary',
      trace: {
        agentId: 'agent-1',
      },
    },
  },
  {
    type: 'trace_update',
    trace: {
      summary: 'Manager trace',
      trace: {
        agentId: 'manager-1',
      },
    },
  },
];

const createWrapper = (props = {}) => {
  const pinia = createTestingPinia({
    createSpy: vi.fn,
    initialState: {
      preview: {
        traces: [...mockTraces],
      },
      AgentsTeam: {
        activeTeam: {
          data: { ...mockTeam },
          status: 'complete',
        },
      },
    },
  });

  return mount(PreviewLogs, {
    props: {
      logsSide: 'left',
      ...props,
    },
    global: {
      plugins: [pinia],
      stubs: {
        TransitionGroup: false,
        PreviewLogsDetailsModal: true,
      },
    },
    attachTo: document.body,
  });
};

describe('PreviewLogs.vue', () => {
  let wrapper;
  let previewStore;
  let agentsTeamStore;

  const previewLogs = () => wrapper.find('[data-testid="preview-logs"]');
  const emptyMessage = () => wrapper.find('[data-testid="preview-logs-empty"]');
  const logItems = () => wrapper.findAll('[data-testid="preview-logs-log"]');
  const logAgentNames = () =>
    wrapper.findAll('[data-testid="preview-logs-log-agent-name"]');
  const stepItems = () =>
    wrapper.findAll('[data-testid="preview-logs-log-step"]');
  const seeFullButtons = () =>
    wrapper.findAll('[data-testid="preview-logs-log-step-see-full"]');
  const progressBar = () =>
    wrapper.find('[data-testid="preview-logs-progress-bar"]');
  const modal = () =>
    wrapper.findComponent('[data-testid="preview-logs-details-modal"]');

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 0,
      bottom: 100,
      height: 20,
    }));

    wrapper = createWrapper();
    previewStore = usePreviewStore();
    agentsTeamStore = useAgentsTeamStore();
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  describe('Component rendering', () => {
    it('matches snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders correctly with required props', () => {
      expect(previewLogs().exists()).toBe(true);
    });

    it('renders the correct number of logs and steps', () => {
      expect(logItems().length).toBe(2);
      expect(stepItems().length).toBe(3);
    });

    it('renders the correct agent names', () => {
      expect(logAgentNames().at(0).text()).toBe('Test Agent 1');
      expect(logAgentNames().at(1).text()).toBe('Manager');
    });

    it('displays empty message when no logs are available', async () => {
      previewStore.traces = [];

      await nextTick();

      expect(emptyMessage().exists()).toBe(true);
      expect(emptyMessage().text()).toBe(
        wrapper.vm.$t('router.preview.no_logs_registered'),
      );
    });
  });

  describe('Logs processing', () => {
    it('correctly processes logs from traces', () => {
      const processedLogs = wrapper.vm.processedLogs;

      expect(processedLogs.length).toBe(2);
      expect(processedLogs[0].external_id).toBe('agent-1');
      expect(processedLogs[0].steps.length).toBe(2);
      expect(processedLogs[1].external_id).toBe('manager-1');
      expect(processedLogs[1].steps.length).toBe(1);
    });

    it('handles empty traces correctly', () => {
      previewStore.traces = [];

      expect(wrapper.vm.processedLogs).toEqual([]);
    });

    it('handles missing agent correctly', () => {
      const tracesWithUnknownAgent = [
        {
          type: 'trace_update',
          trace: {
            summary: 'Unknown agent trace',
            trace: {
              agentId: 'unknown-agent',
            },
          },
        },
      ];

      previewStore.traces = tracesWithUnknownAgent;

      expect(wrapper.vm.processedLogs.length).toBe(1);
      expect(wrapper.vm.processedLogs[0].external_id).toBe('manager-1');
    });
  });

  describe('Progress bar functionality', () => {
    it('calculates progress bar height on mount', async () => {
      await nextTick();
      expect(typeof wrapper.vm.progressHeight).toBe('number');
      expect(progressBar().exists()).toBe(true);
    });
  });

  describe('Modal functionality', () => {
    it('opens modal with correct details when "see full details" is clicked', async () => {
      expect(modal().props('modelValue')).toBeFalsy();

      await seeFullButtons().at(0).trigger('click');

      expect(modal().props('modelValue')).toBeTruthy();

      expect(modal().props('title')).toBe('First trace summary');
      expect(modal().props('trace')).toEqual(mockTraces[0].trace);
    });

    it('closes modal correctly', async () => {
      await seeFullButtons().at(0).trigger('click');
      expect(modal().props('modelValue')).toBeTruthy();

      await modal().vm.$emit('update:modelValue', false);

      expect(wrapper.vm.showDetailsModal).toBe(false);
    });
  });

  describe('Events', () => {
    it('emits scroll-to-bottom when updateProgressBarHeight is called', async () => {
      await wrapper.vm.updateProgressBarHeight();
      await nextTick();

      expect(wrapper.emitted('scroll-to-bottom')).toBeTruthy();
    });
  });
});

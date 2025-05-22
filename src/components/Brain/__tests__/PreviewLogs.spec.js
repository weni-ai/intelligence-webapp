import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';

import PreviewLogs from '../PreviewLogs.vue';

import { usePreviewStore } from '@/store/Preview';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

const mockAllAgents = {
  agents: [
    { id: 'agent-1', name: 'Test Agent 1' },
    { id: 'agent-2', name: 'Test Agent 2' },
  ],
  manager: { id: 'manager', name: 'Manager' },
};

const mockLogs = [
  {
    type: 'trace_update',
    data: {
      trace: {},
    },
    config: {
      agentName: 'agent-1',
      icon: 'icon-1',
      summary: 'First trace summary',
    },
  },
  {
    type: 'trace_update',
    data: null,
    config: {
      agentName: 'agent-1',
      icon: 'icon-2',
      summary: 'Second trace summary',
    },
  },
  {
    type: 'trace_update',
    data: null,
    config: {
      agentName: 'manager',
      summary: 'Manager trace',
    },
  },
];

const createWrapper = (props = {}) => {
  const pinia = createTestingPinia({
    initialState: {
      preview: {
        logs: [...mockLogs],
      },
    },
  });

  return mount(PreviewLogs, {
    props: {
      logs: mockLogs,
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
  const logStepIcons = () =>
    wrapper.findAll('[data-testid="preview-logs-log-step-icon"]');
  const logStepIconsIcon = () =>
    wrapper.findAll('[data-testid="preview-logs-log-step-icon-icon"]');
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
    agentsTeamStore.allAgents = mockAllAgents;
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

    it('renders the correct icon for each step', () => {
      expect(logStepIcons().length).toBe(2);
      expect(logStepIconsIcon().at(0).text()).toBe('icon-1');
      expect(logStepIconsIcon().at(1).text()).toBe('icon-2');
    });

    it('renders the correct agent names', () => {
      expect(logAgentNames().at(0).text()).toBe('Test Agent 1');
      expect(logAgentNames().at(1).text()).toBe('Manager');
    });

    it('displays empty message when no logs are available', async () => {
      await wrapper.setProps({ logs: [] });

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
      expect(processedLogs[0].agent).toBe('Test Agent 1');
      expect(processedLogs[0].steps.length).toBe(2);
      expect(processedLogs[1].agent).toBe('Manager');
      expect(processedLogs[1].steps.length).toBe(1);
    });

    it('handles empty traces correctly', async () => {
      await wrapper.setProps({ logs: [] });

      expect(wrapper.vm.processedLogs).toEqual([]);
    });

    it('handles missing agent correctly', async () => {
      const logsWithUnknownAgent = [
        {
          type: 'trace_update',
          summary: 'Unknown agent trace',
          data: null,
          config: {
            agentId: 'unknown-agent',
          },
        },
      ];

      await wrapper.setProps({ logs: logsWithUnknownAgent });

      expect(wrapper.vm.processedLogs.length).toBe(1);
      expect(wrapper.vm.processedLogs[0].agent).toBe('Manager');
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
      expect(modal().props('log')).toEqual(mockLogs[0]);
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

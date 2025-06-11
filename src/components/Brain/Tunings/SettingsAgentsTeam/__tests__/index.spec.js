import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import SettingsAgentsTeam from '../index.vue';
import AgentsPreview from '../AgentsPreview.vue';
import HumanSupport from '../HumanSupport.vue';

describe('SettingsAgentsTeam/index.vue', () => {
  let wrapper;
  let store;

  const agentsPreviewComponent = () =>
    wrapper.findComponent('[data-testid="agents-preview"]');
  const humanSupportComponent = () =>
    wrapper.findComponent('[data-testid="human-support"]');
  const mainContainer = () =>
    wrapper.find('[data-testid="settings-agents-team"]');

  beforeEach(() => {
    wrapper = shallowMount(SettingsAgentsTeam);
  });

  afterEach(() => {
    wrapper.unmount();
    vi.clearAllMocks();
  });

  describe('Component rendering', () => {
    it('renders the AgentsPreview component', () => {
      expect(agentsPreviewComponent().exists()).toBe(true);
    });

    it('renders the HumanSupport component', () => {
      expect(humanSupportComponent().exists()).toBe(true);
    });
  });

  describe('Component structure and layout', () => {
    it('renders components in correct order', () => {
      const container = mainContainer();
      const children = Array.from(container.element.children);

      expect(children).toHaveLength(2);
      expect(children[0].getAttribute('data-testid')).toBe('agents-preview');
      expect(children[1].getAttribute('data-testid')).toBe('human-support');
    });
  });
});

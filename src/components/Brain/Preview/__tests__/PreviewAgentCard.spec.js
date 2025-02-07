import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PreviewAgentCard from '../PreviewAgentCard.vue';

describe('PreviewAgentCard.vue', () => {
  let wrapper;

  const createWrapper = (props = {}) => {
    return mount(PreviewAgentCard, {
      props: {
        type: 'agent',
        name: 'Test Agent',
        active: false,
        currentTask: 'Processing',
        ...props,
      },
    });
  };

  beforeEach(() => {
    wrapper = createWrapper();
  });

  const agentCard = () => wrapper.find('[data-testid="preview-agent-card"]');
  const agentCardIcon = () =>
    wrapper.find('[data-testid="preview-agent-card-icon"]');
  const agentCardName = () =>
    wrapper.find('[data-testid="preview-agent-card-name"]');
  const agentCardStatus = () =>
    wrapper.find('[data-testid="preview-agent-card-status"]');

  it('should render correctly with required props', () => {
    expect(wrapper.exists()).toBe(true);
    expect(agentCard().exists()).toBe(true);
  });

  it('should display the correct name', () => {
    const name = 'Test Agent Name';
    wrapper = createWrapper({ name });
    expect(agentCardName().text()).toBe(name);
  });

  it('should display currentTask when provided', () => {
    const currentTask = 'Analyzing data';
    wrapper = createWrapper({ currentTask });
    expect(agentCardStatus().text()).toBe(currentTask);
  });

  it('should display "Standby" when no currentTask is active', () => {
    wrapper = createWrapper({ currentTask: '' });
    expect(agentCardStatus().text()).toBe('Standby');
  });

  it('should show icon only for manager type', () => {
    wrapper = createWrapper({ type: 'manager' });

    expect(agentCardIcon().exists()).toBe(true);

    wrapper = createWrapper({ type: 'agent' });
    expect(agentCardIcon().exists()).toBe(false);
  });

  it('should apply active class when active prop is true', () => {
    wrapper = createWrapper({ active: true });
    expect(agentCard().classes()).toContain('preview-agent-card--active');
  });

  it('should apply standby class when active prop is false', () => {
    wrapper = createWrapper({ active: false });
    expect(agentCard().classes()).toContain('preview-agent-card--standby');
  });

  it('should apply animated class for active agents', () => {
    wrapper = createWrapper({ active: true, type: 'agent' });
    expect(agentCard().classes()).toContain('preview-agent-card--animated');
  });

  it('should not apply animated class for active managers', () => {
    wrapper = createWrapper({ active: true, type: 'manager' });
    expect(agentCard().classes()).not.toContain('preview-agent-card--animated');
  });
});

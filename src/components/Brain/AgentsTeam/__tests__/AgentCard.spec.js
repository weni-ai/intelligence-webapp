import { beforeEach, it } from 'vitest';
import { mount } from '@vue/test-utils';

import { createTestingPinia } from '@pinia/testing';
import { useAgentsTeamStore } from '@/store/AgentsTeam';

import AgentCard from '../AgentCard.vue';

const pinia = createTestingPinia({
  initialState: {
    officialAgents: {
      status: null,
      data: [],
    },
    myAgents: {
      status: null,
      data: [],
    },
  },
});

describe('AgentCard.vue', () => {
  let wrapper;

  const agentsTeamStore = useAgentsTeamStore();

  beforeEach(() => {
    wrapper = mount(AgentCard, {
      global: {
        plugins: [pinia],
      },
      props: {
        loading: false,
        title: 'Test Title',
        description: 'Test Description',
        skills: [
          { name: 'Skill 1', icon: 'icon-1' },
          { name: 'Skill 2', icon: 'icon-2' },
        ],
      },
    });
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should renders correctly when loading', async () => {
    await wrapper.setProps({ loading: true });

    expect(
      wrapper.findComponent('[data-testid="agent-card-skeleton"]').exists(),
    ).toBe(true);
  });

  it('should renders correctly when not loading', () => {
    expect(wrapper.find('[data-testid="title"]').text()).toBe('Test Title');
    expect(wrapper.find('[data-testid="description"]').text()).toBe(
      'Test Description',
    );
    expect(wrapper.findAll('[data-testid="skill"]').length).toBe(2);
  });

  it('should renders skills correctly', () => {
    const skills = wrapper.findAllComponents('[data-testid="skill"]');
    expect(skills[0].props('title')).toBe('Skill 1');
    expect(skills[0].props('icon')).toBe('icon-1');
    expect(skills[1].props('title')).toBe('Skill 2');
    expect(skills[1].props('icon')).toBe('icon-2');
  });

  describe('Assign button', () => {
    beforeEach(async () => {
      await wrapper.setProps({ assignment: true });
    });

    const assignButton = () =>
      wrapper.findComponent('[data-testid="assign-button"]');

    test('renders assign button with correct type and iconLeft', async () => {
      expect(assignButton().props('type')).toBe('primary');
      expect(assignButton().props('iconLeft')).toBe('');

      await wrapper.setProps({ assigned: true });

      expect(assignButton().props('type')).toBe('secondary');
      expect(assignButton().props('iconLeft')).toBe('check');
    });

    it('calls toggleAgentAssignment when button is clicked', async () => {
      await wrapper
        .findComponent('[data-testid="assign-button"]')
        .trigger('click');

      expect(agentsTeamStore.toggleAgentAssignment).toHaveBeenCalledWith({
        uuid: wrapper.props('uuid'),
        is_assigned: !wrapper.props('assigned'),
      });
    });

    it('should add empty class when empty prop is true', async () => {
      await wrapper.setProps({ empty: true });

      const agentCard = wrapper.find('[data-testid="agent-card"]');

      expect(agentCard.classes()).toContain('agent-card--empty');
    });

    it('should render agent card empty when empty prop is true', async () => {
      await wrapper.setProps({ empty: true });

      expect(wrapper.find('[data-testid="agent-card-empty"]').exists()).toBe(
        true,
      );
    });

    it('should log error when toggleAgentAssignment throws an error', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      agentsTeamStore.toggleAgentAssignment = vi
        .fn()
        .mockRejectedValue(new Error(''));

      await wrapper.vm.toggleAgentAssignment();

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});

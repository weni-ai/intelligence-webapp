import { beforeEach, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import { createTestingPinia } from '@pinia/testing';
import { useAgentsTeamStore } from '@/store/AgentsTeam';
import i18n from '@/utils/plugins/i18n';

import AssignAgentCard from '../AssignAgentCard.vue';

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

describe('AssignAgentCard.vue', () => {
  let wrapper;

  const agentsTeamStore = useAgentsTeamStore();

  beforeEach(() => {
    wrapper = mount(AssignAgentCard, {
      global: {
        plugins: [pinia],
      },
      props: {
        loading: false,
        agent: {
          name: 'Test Title',
          description: 'Test Description',
          skills: [
            { name: 'Skill 1', icon: 'icon-1' },
            { name: 'Skill 2', icon: 'icon-2' },
          ],
        },
      },
    });
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('should renders correctly when loading', async () => {
    await wrapper.setProps({ loading: true });

    expect(
      wrapper
        .findComponent('[data-testid="assign-agent-card-skeleton"]')
        .exists(),
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

  describe('ContentHeader', () => {
    it('should render header actions when assignment is false', async () => {
      await wrapper.setProps({ assignment: false });
      expect(
        wrapper.find('[data-testid="assign-agent-card-actions"]').exists(),
      ).toBe(true);
    });

    it('should not render header actions when assignment is true', () => {
      expect(
        wrapper.find('[data-testid="assign-agent-card-actions"]').exists(),
      ).toBe(false);
    });

    it('should render official tag when agent is official', async () => {
      await wrapper.setProps({
        assignment: false,
        agent: {
          ...wrapper.props('agent'),
          is_official: true,
        },
      });

      const tag = wrapper.findComponent('[data-testid="agent-tag"]');
      expect(tag.props('text')).toBe(
        i18n.global.t('router.agents_team.card.official'),
      );

      expect(tag.props('scheme')).toBe('weni');
    });

    it('should render custom tag when agent is not official', async () => {
      await wrapper.setProps({
        assignment: false,
        agent: {
          ...wrapper.props('agent'),
          is_official: false,
        },
      });

      const tag = wrapper.findComponent('[data-testid="agent-tag"]');
      expect(tag.props('text')).toBe(
        i18n.global.t('router.agents_team.card.custom'),
      );
      expect(tag.props('scheme')).toBe('aux-purple');
    });
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

      await wrapper.setProps({
        agent: { ...wrapper.props('agent'), assigned: true },
      });

      expect(assignButton().props('type')).toBe('secondary');
      expect(assignButton().props('iconLeft')).toBe('check');
    });

    it('calls toggleAgentAssignment when button is clicked for an agent without credentials', async () => {
      await wrapper.setProps({
        agent: { ...wrapper.props('agent'), assigned: false },
      });

      const toggleAgentAssignmentSpy = vi.spyOn(
        wrapper.vm,
        'toggleAgentAssignment',
      );

      await assignButton().trigger('click');

      expect(toggleAgentAssignmentSpy).toHaveBeenCalled();
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

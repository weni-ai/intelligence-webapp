import { mount } from '@vue/test-utils';

import AgentCard from '../AgentCard.vue';

describe('AgentCard.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(AgentCard, {
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

  it('should emits assign event when button is clicked', async () => {
    await wrapper.setProps({ assignment: true });
    await wrapper.find('[data-testid="assign-button"]').trigger('click');
    expect(wrapper.emitted('assign')).toHaveLength(1);
  });
});

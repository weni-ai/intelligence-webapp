import { mount } from '@vue/test-utils';

import AssignAgentSkeleton from '../AssignAgentSkeleton.vue';

describe('AgentCardSkeleton.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(AssignAgentSkeleton);
  });

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders skeleton loading components', () => {
    const skeletonLoadings = wrapper.findAll(
      '[data-testid="assign-agent-skeleton-loading"]',
    );
    expect(skeletonLoadings.length).toBe(3);
  });

  it('renders skills section', () => {
    const skillsSection = wrapper.find(
      '[data-testid="assign-agent-skills-section"]',
    );
    expect(skillsSection.exists()).toBe(true);
  });

  it('renders skills skeleton loadings', () => {
    const skillsSkeletonLoadings = wrapper.findAll(
      '[data-testid="assign-agent-skills-skeleton-loading"]',
    );
    expect(skillsSkeletonLoadings.length).toBe(2);
  });
});

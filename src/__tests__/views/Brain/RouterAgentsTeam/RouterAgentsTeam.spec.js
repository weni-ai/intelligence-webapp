import { shallowMount } from '@vue/test-utils';

import RouterAgentsTeam from '@/views/Brain/RouterAgentsTeam/index.vue';
import ActiveTeam from '@/views/Brain/RouterAgentsTeam/ActiveTeam.vue';
import AgentsGallery from '@/views/Brain/RouterAgentsTeam/AgentsGallery.vue';
import UnnnicDivider from '@/components/Divider.vue';

describe('RouterAgentsTeam', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(RouterAgentsTeam);
  });

  it('matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders the all components', () => {
    expect(wrapper.findComponent(ActiveTeam).exists()).toBe(true);
    expect(wrapper.findComponent(UnnnicDivider).exists()).toBe(true);
    expect(wrapper.findComponent(AgentsGallery).exists()).toBe(true);
  });
});

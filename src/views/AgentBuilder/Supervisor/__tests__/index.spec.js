import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createPinia } from 'pinia';

import Supervisor from '@/views/AgentBuilder/Supervisor/index.vue';

describe('Supervisor view', () => {
  let wrapper;

  beforeEach(() => {
    const pinia = createPinia();

    wrapper = shallowMount(Supervisor, {
      global: {
        plugins: [pinia],
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('matches snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders BrainHeader component', () => {
    expect(wrapper.findComponent('[data-testid="header"]').exists()).toBe(true);
  });

  it('renders SupervisorPerformance component', () => {
    expect(
      wrapper
        .findComponent('[data-testid="supervisor-conversations"]')
        .exists(),
    ).toBe(true);
  });
});

import { shallowMount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';

import Instructions from '../index.vue';

describe('Instructions.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Instructions);
  });

  const SELECTORS = {
    instructionsHeader: '[data-testid="instructions-header"]',
  };

  const findComponent = (component) =>
    wrapper.findComponent(SELECTORS[component]);
  const find = (selector) => wrapper.find(selector);

  describe('Component rendering', () => {
    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders components correctly', () => {
      expect(findComponent('instructionsHeader').exists()).toBe(true);
    });
  });
});

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
    newInstruction: '[data-testid="new-instruction"]',
    instructionsList: '[data-testid="instructions-list"]',
  };

  const findComponent = (component) =>
    wrapper.findComponent(SELECTORS[component]);

  describe('Component rendering', () => {
    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders components correctly', () => {
      expect(findComponent('instructionsHeader').exists()).toBe(true);
      expect(findComponent('newInstruction').exists()).toBe(true);
      expect(findComponent('instructionsList').exists()).toBe(true);
    });
  });
});

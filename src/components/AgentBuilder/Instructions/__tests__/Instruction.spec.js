import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';

import Instruction from '../Instruction.vue';

describe('Instruction.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Instruction, {
      props: {
        text: 'Test instruction',
      },
    });
  });

  const SELECTORS = {
    text: '[data-testid="instruction-text"]',
  };
  const find = (selector) => wrapper.find(SELECTORS[selector]);

  describe('Component rendering', () => {
    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders components correctly', () => {
      expect(find('text').exists()).toBe(true);
    });
  });

  describe('Component props', () => {
    it('renders the correct text', () => {
      expect(find('text').text()).toBe('Test instruction');
    });
  });
});

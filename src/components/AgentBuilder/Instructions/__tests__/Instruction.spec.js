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
    tag: '[data-testid="instruction-tag"]',
  };
  const find = (selector) => wrapper.find(SELECTORS[selector]);

  describe('Component rendering', () => {
    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders components correctly', () => {
      expect(find('text').exists()).toBe(true);
      expect(find('tag').exists()).toBe(false);
    });
  });

  describe('Component props', () => {
    it('renders the correct text', () => {
      expect(find('text').text()).toBe('Test instruction');
    });

    it('renders the correct tag', async () => {
      await wrapper.setProps({ tag: 'Test tag' });
      expect(find('tag').exists()).toBe(true);
      expect(find('tag').text()).toBe('Test tag');
    });
  });
});

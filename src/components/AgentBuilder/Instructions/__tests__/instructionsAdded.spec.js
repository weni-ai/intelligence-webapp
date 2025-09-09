import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';

import InstructionsAdded from '../InstructionsAdded.vue';
import i18n from '@/utils/plugins/i18n';

describe('InstructionsAdded.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    initialState: {
      instructions: {
        status: 'loading',
      },
    },
  });

  beforeEach(() => {
    wrapper = shallowMount(InstructionsAdded, {
      global: {
        plugins: [pinia],
      },
    });
  });

  const SELECTORS = {
    title: '[data-testid="instructions-title"]',
    instructions: '[data-testid="instructions"]',
    instructionLoading: '[data-testid="instruction-loading"]',
  };

  const findComponent = (component) =>
    wrapper.findComponent(SELECTORS[component]);
  const find = (selector) => wrapper.find(SELECTORS[selector]);

  const translation = (key) =>
    i18n.global.t(`agent_builder.instructions.instructions_added.${key}`);

  it('should match snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  describe('Component rendering', () => {
    it('renders components correctly', () => {
      expect(find('title').exists()).toBe(true);
      expect(find('instructions').exists()).toBe(true);
    });

    it('renders title correctly', () => {
      expect(find('title').text()).toBe(translation('title'));
    });
  });

  describe('Loading state', () => {
    it('renders loading elements when status is loading', () => {
      expect(find('instructions').exists()).toBe(true);
      expect(find('instructions').classes()).toContain(
        'instructions-added__instructions--loading',
      );
      expect(
        wrapper.findAllComponents(SELECTORS.instructionLoading).length,
      ).toBe(10);
    });

    it('hides loading list when status is complete', async () => {
      wrapper.vm.instructionsStore.instructions.status = 'complete';
      await wrapper.vm.$nextTick();
      expect(findComponent('instructionLoading').exists()).toBe(false);
    });
  });
});

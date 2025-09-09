import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';

import InstructionsAdded from '../InstructionsAdded.vue';
import i18n from '@/utils/plugins/i18n';

describe('InstructionsAdded.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    initialState: {
      Instructions: {
        instructions: {
          status: 'complete',
          data: [
            { id: 1, text: 'Instruction 1' },
            { id: 2, text: 'Instruction 2' },
          ],
        },
      },
    },
  });

  function setup() {
    wrapper = shallowMount(InstructionsAdded, {
      global: {
        plugins: [pinia],
        stubs: ['UnnnicSkeletonLoading'],
      },
    });
  }

  beforeEach(() => {
    setup();
  });

  const SELECTORS = {
    title: '[data-testid="instructions-title"]',
    instructions: '[data-testid="instructions"]',
    instructionLoading: '[data-testid="instruction-loading"]',
    instructionDefault: '[data-testid="instruction-default"]',
    instructionAdded: '[data-testid="instruction-added"]',
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
      expect(findComponent('instructionLoading').exists()).toBe(false);
      expect(findComponent('instructionDefault').exists()).toBe(true);
      expect(findComponent('instructionAdded').exists()).toBe(true);
    });

    it('renders title correctly', () => {
      expect(find('title').text()).toBe(translation('title'));
    });

    it('renders default instructions correctly', () => {
      expect(findComponent('instructionDefault').exists()).toBe(true);
      expect(
        findComponent('instructionDefault').props('instruction'),
      ).toStrictEqual({
        id: 'default-0',
        text: translation('default_instructions.0'),
      });
      expect(findComponent('instructionDefault').props('tag')).toBe(
        translation('default_instruction'),
      );
    });

    it('renders added instructions correctly', () => {
      expect(findComponent('instructionAdded').exists()).toBe(true);
      expect(
        findComponent('instructionAdded').props('instruction'),
      ).toStrictEqual({
        id: 1,
        text: 'Instruction 1',
      });
    });
  });

  describe('Loading state', () => {
    it('renders loading elements when status is loading', async () => {
      wrapper.vm.instructionsStore.instructions.status = 'loading';
      await wrapper.vm.$nextTick();
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

  describe('Load instructions logic', () => {
    it('calls loadInstructions when status is null', async () => {
      const loadInstructionsSpy = vi.fn();

      wrapper.vm.instructionsStore.instructions.status = null;
      wrapper.vm.instructionsStore.loadInstructions = loadInstructionsSpy;
      setup();

      expect(loadInstructionsSpy).toHaveBeenCalled();
    });

    ['complete', 'loading', 'error'].forEach((status) => {
      it(`does not call loadInstructions when status is ${status}`, async () => {
        const loadInstructionsSpy = vi.fn();

        wrapper.vm.instructionsStore.instructions.status = status;
        wrapper.vm.instructionsStore.loadInstructions = loadInstructionsSpy;
        setup();

        expect(loadInstructionsSpy).not.toHaveBeenCalled();
      });
    });
  });
});

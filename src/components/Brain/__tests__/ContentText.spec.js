import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import ContentText from '@/components/Brain/ContentText.vue';

describe('ContentText.vue', () => {
  let wrapper;

  const createWrapper = (props = {}) => {
    wrapper = mount(ContentText, {
      props: {
        modelValue: 'Initial text',
        ...props,
      },
    });
  };

  beforeEach(() => {
    createWrapper();
  });

  describe('when isLoading is true', () => {
    beforeEach(() => {
      createWrapper({ isLoading: true });
    });

    it('renders the skeleton loader', () => {
      const skeletonLoader = wrapper.findComponent({
        name: 'UnnnicSkeletonLoading',
      });
      expect(skeletonLoader.exists()).toBeTruthy();
    });

    it('does not render the textarea', () => {
      const textarea = wrapper.find('textarea');
      expect(textarea.exists()).toBeFalsy();
    });
  });

  describe('when isLoading is false', () => {
    beforeEach(() => {
      createWrapper({ isLoading: false });
    });

    it('renders the textarea with the correct initial value', () => {
      const textarea = wrapper.find('textarea');
      expect(textarea.exists()).toBeTruthy();
      expect(textarea.element.value).toBe('Initial text');
    });

    it('renders the header with the description text', () => {
      const headerText = wrapper.find('header p');
      expect(headerText.exists()).toBeTruthy();
      expect(headerText.text()).toBe(
        wrapper.vm.$t('content_bases.text.description'),
      );
    });
  });

  describe('when user edits the textarea', () => {
    beforeEach(async () => {
      const textarea = wrapper.find('textarea');

      await textarea.setValue('Edited text');
    });

    it('emits update:modelValue with the edited value', () => {
      expect(wrapper.emitted('update:modelValue')).toBeTruthy();
      expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Edited text']);
    });
  });
});
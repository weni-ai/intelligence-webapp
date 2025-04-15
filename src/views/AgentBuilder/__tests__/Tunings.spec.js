import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { describe, it, expect, beforeEach } from 'vitest';

import { useTuningsStore } from '@/store/Tunings';

import Tunings from '@/views/AgentBuilder/Tunings.vue';

const pinia = createTestingPinia();

describe('Tunings.vue', () => {
  let wrapper;
  let tuningsStore;

  const brainHeader = () =>
    wrapper.findComponent('[data-testid="brain-header"]');
  const unnnicTab = () => wrapper.findComponent('[data-testid="unnnic-tab"]');
  const credentials = () =>
    wrapper.findComponent('[data-testid="credentials"]');
  const settings = () => wrapper.findComponent('[data-testid="settings"]');
  const changesHistory = () =>
    wrapper.findComponent('[data-testid="changes-history"]');

  beforeEach(() => {
    wrapper = shallowMount(Tunings, {
      global: {
        plugins: [pinia],
      },
    });

    tuningsStore = useTuningsStore();
  });

  describe('Component rendering', () => {
    it('renders correctly', () => {
      expect(brainHeader().exists()).toBe(true);
      expect(unnnicTab().exists()).toBe(true);
    });

    it('renders the Credentials component by default', () => {
      expect(credentials().exists()).toBe(true);
      expect(settings().exists()).toBe(false);
      expect(changesHistory().exists()).toBe(false);
    });

    it('renders tab content based on activeTab value', async () => {
      expect(credentials().exists()).toBe(true);

      await wrapper.vm.onTabChange('config');
      expect(credentials().exists()).toBe(false);
      expect(settings().exists()).toBe(true);
      expect(changesHistory().exists()).toBe(false);

      await wrapper.vm.onTabChange('hist');
      expect(credentials().exists()).toBe(false);
      expect(settings().exists()).toBe(false);
      expect(changesHistory().exists()).toBe(true);
    });
  });

  describe('Component lifecycle', () => {
    it('fetches settings on mount', () => {
      expect(tuningsStore.fetchSettings).toHaveBeenCalled();
    });
  });

  describe('User interactions', () => {
    it('changes activeTab when tab is changed', async () => {
      expect(wrapper.vm.activeTab).toBe('credentials');

      await wrapper.vm.onTabChange('hist');
      expect(wrapper.vm.activeTab).toBe('hist');
    });

    it('passes correct tabs to UnnnicTab component', () => {
      expect(unnnicTab().props('tabs')).toEqual(['credentials', 'hist']);
      expect(unnnicTab().props('activeTab')).toBe('credentials');
    });
  });
});

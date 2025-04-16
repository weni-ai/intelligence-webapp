import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStore } from 'vuex';

import Knowledge from '@/views/AgentBuilder/Knowledge.vue';

vi.mock('vue-router', () => ({
  useRoute: vi.fn(() => ({
    params: {
      contentBaseUuid: 'test-uuid',
    },
  })),
}));

const store = createStore({
  state: {
    router: {
      contentBaseUuid: 'fallback-uuid',
    },
    Brain: {
      contentText: {
        uuid: null,
        current: '',
        old: '',
      },
    },
  },
});

vi.mock('@/api/nexusaiAPI', () => ({
  default: {
    intelligences: {
      contentBases: {
        texts: {
          list: vi.fn().mockResolvedValue({
            data: {
              results: [
                {
                  uuid: 'text-uuid',
                  text: 'Sample text content',
                },
              ],
            },
          }),
        },
      },
    },
  },
}));

vi.mock('@/views/ContentBases/filesPagination', () => ({
  useFilesPagination: vi.fn(() => ({
    loadNext: vi.fn(),
  })),
}));

vi.mock('@/views/ContentBases/sitesPagination', () => ({
  useSitesPagination: vi.fn(() => ({
    loadNext: vi.fn(),
  })),
}));

describe('Knowledge.vue', () => {
  let wrapper;

  const brainHeader = () =>
    wrapper.findComponent('[data-testid="brain-header"]');
  const routerContentBase = () =>
    wrapper.findComponent('[data-testid="router-content-base"]');

  beforeEach(() => {
    wrapper = shallowMount(Knowledge, {
      global: {
        plugins: [store],
      },
    });
  });

  describe('Component rendering', () => {
    it('renders correctly', () => {
      expect(wrapper.exists()).toBe(true);
      expect(brainHeader().exists()).toBe(true);
      expect(routerContentBase().exists()).toBe(true);
    });

    it('passes correct props to RouterContentBase', () => {
      const props = routerContentBase().props();

      expect(props.filesProp).toBeDefined();
      expect(props.sitesProp).toBeDefined();
      expect(props.textProp).toEqual({
        open: true,
        status: null,
        uuid: 'text-uuid',
        oldValue: 'Sample text content',
        value: 'Sample text content',
      });
      expect(props.textLoading).toBe(false);
    });
  });

  describe('Component lifecycle', () => {
    it('loads text, files and sites on mount', () => {
      expect(wrapper.vm.text.uuid).toBe('text-uuid');
      expect(wrapper.vm.text.value).toBe('Sample text content');
      expect(wrapper.vm.text.oldValue).toBe('Sample text content');
      expect(wrapper.vm.text.status).toBeNull();
      expect(wrapper.vm.files.loadNext).toHaveBeenCalled();
      expect(wrapper.vm.sites.loadNext).toHaveBeenCalled();
    });
  });
});

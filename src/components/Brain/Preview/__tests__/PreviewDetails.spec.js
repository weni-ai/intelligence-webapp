import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia } from 'pinia';
import Unnnic from '@weni/unnnic-system';

import { usePreviewStore } from '@/store/Preview';
import i18n from '@/utils/plugins/i18n';

import PreviewLogs from '@/components/Brain/PreviewLogs.vue';
import PreviewDetails from '../PreviewDetails.vue';

vi.mock('@/components/Brain/PreviewLogs.vue');
vi.mock('../PreviewVisualFlow.vue');

describe('PreviewDetails.vue', () => {
  let wrapper;
  let previewStore;

  const pinia = createPinia();

  const createWrapper = (props = {}) => {
    return mount(PreviewDetails, {
      props: {
        ...props,
      },
      global: {
        plugins: [pinia],
      },
    });
  };

  beforeEach(() => {
    wrapper = createWrapper();
    previewStore = usePreviewStore();
  });

  const previewDetails = () => wrapper.find('[data-testid="preview-details"]');
  const previewDetailsTabs = () =>
    wrapper.find('[data-testid="preview-details-tabs"]');
  const previewDetailsContent = () =>
    wrapper.find('[data-testid="preview-details-content"]');
  const previewDetailsVisualFlow = () =>
    wrapper.find('[data-testid="preview-details-visual-flow"]');
  const previewDetailsLogs = () =>
    wrapper.find('[data-testid="preview-details-logs"]');

  const switchToLogsTab = async () => {
    await wrapper.findComponent(Unnnic.unnnicTab).vm.$emit('change', 'logs');
    await wrapper.vm.$nextTick();
  };

  it('should render correctly with required props', () => {
    expect(previewDetails().exists()).toBe(true);
    expect(previewDetailsTabs().exists()).toBe(true);
    expect(previewDetailsContent().exists()).toBe(true);
  });

  it('should show visual flow by default', () => {
    expect(previewDetailsVisualFlow().exists()).toBe(true);
    expect(previewDetailsLogs().exists()).toBe(false);
  });

  it('should switch to logs when tab changes', async () => {
    await switchToLogsTab();

    expect(previewDetailsVisualFlow().exists()).toBe(false);
    expect(previewDetailsLogs().exists()).toBe(true);
  });

  it('should have correct tabs configuration', () => {
    expect(wrapper.vm.detailTabs).toEqual(['visual_flow', 'logs']);
  });

  it('should scroll content to bottom when logs component emits scroll event if it is near the bottom', async () => {
    await switchToLogsTab();

    const mockScrollTo = vi.fn();
    wrapper.vm.contentRef = {
      scrollTo: mockScrollTo,
      scrollHeight: 100,
      scrollTop: 0,
      clientHeight: 0,
    };

    await wrapper.findComponent(PreviewLogs).vm.$emit('scroll-to-bottom');

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 100,
      behavior: 'smooth',
    });
  });

  it('should not scroll content to bottom when logs component emits scroll event if it is not near the bottom', async () => {
    await switchToLogsTab();

    const mockScrollTo = vi.fn();
    wrapper.vm.contentRef = {
      scrollTo: mockScrollTo,
      scrollHeight: 100,
    };
  });
});

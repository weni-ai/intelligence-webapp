import { mount } from '@vue/test-utils';
import RouterPreviewFullPage from '@/views/Brain/RouterPreviewFullPage.vue';

describe('RouterPreviewFullPage.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(RouterPreviewFullPage, {
      global: {
        components: {
          Preview: {
            template: '<div class="preview-stub" :usePreview="true"></div>',
            props: ['usePreview'],
          },
        },
      },
    });
  });

  test('applies the height style to the preview section', () => {
    const previewSection = wrapper.find('.preview-full-page');

    expect(previewSection.attributes().style).toBe(
      `height: ${wrapper.vm.height}px;`,
    );
  });

  test('updates height on window resize', async () => {
    const newHeight = 500;

    window.visualViewport = { height: newHeight };
    window.dispatchEvent(new Event('resize'));

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.height).toBe(newHeight);

    const section = wrapper.find('.preview-full-page');
    expect(section.attributes('style')).toContain(`height: ${newHeight}px;`);
  });

  test('contains Preview component with correct prop', () => {
    const previewComponent = wrapper.findComponent({ name: 'Preview' });

    expect(previewComponent.exists()).toBe(true);

    expect(previewComponent.attributes().usepreview).toBe('true');
  });

  test('sets overscroll-behavior style on mount', () => {
    expect(document.documentElement.style.overscrollBehavior).toBe('none');
  });

  test('updates the height data property and style correctly when the window visual viewport height changes', async () => {
    const newHeight = 500;
    Object.defineProperty(window, 'visualViewport', {
      value: { height: newHeight },
      writable: true,
    });

    window.dispatchEvent(new Event('resize'));

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.height).toBe(newHeight);
    expect(wrapper.find('.preview-full-page').attributes().style).toBe(
      `height: ${newHeight}px;`,
    );
  });

  test('sets default height if visualViewport is undefined', () => {
    window.visualViewport = undefined;
    window.dispatchEvent(new Event('resize'));

    expect(wrapper.vm.height).toBe(10);
  });

  afterEach(() => {
    document.documentElement.style.overscrollBehavior = '';
    window.visualViewport = null;
  });
});

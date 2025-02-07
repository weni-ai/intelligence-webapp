import { shallowMount } from '@vue/test-utils';
import CredentialsSkeleton from '../Credentials/CredentialsSkeleton.vue';

describe('CredentialsSkeleton.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CredentialsSkeleton);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render 3 skeleton items with label and input skeletons', () => {
    const skeletonItems = wrapper.findAll(
      '[data-testid="credentials-skeleton-item"]',
    );
    expect(skeletonItems).toHaveLength(3);

    skeletonItems.forEach((item) => {
      const skeletonLoadings = item.findAllComponents(
        '[data-testid="skeleton-loading"]',
      );
      expect(skeletonLoadings).toHaveLength(2);

      // Label skeleton
      expect(skeletonLoadings[0].props('height')).toBe('21px');
      expect(skeletonLoadings[0].props('tag')).toBe('div');

      // Input skeleton
      expect(skeletonLoadings[1].props('height')).toBe('45px');
      expect(skeletonLoadings[1].props('width')).toBe('100%');
      expect(skeletonLoadings[1].props('tag')).toBe('div');
    });
  });

  it('should render an button skeleton loading at the bottom', () => {
    const buttonSkeleton = wrapper
      .findAllComponents('[data-testid="skeleton-loading"]')
      .at(-1);
    expect(buttonSkeleton.exists()).toBeTruthy();
    expect(buttonSkeleton.props('height')).toBe('45px');
    expect(buttonSkeleton.props('width')).toBe('100%');
    expect(buttonSkeleton.props('tag')).toBe('div');
  });
});

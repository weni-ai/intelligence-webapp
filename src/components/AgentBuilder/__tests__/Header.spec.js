import { shallowMount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import Header from '../Header.vue';
import useBrainRoutes from '@/composables/useBrainRoutes';

vi.mock('@/composables/useBrainRoutes', () => {
  return {
    default: vi.fn(() => {
      return {
        value: [
          {
            title: 'Test Route',
            description: 'Test Description',
            page: 'test-page',
            icon: 'test-icon',
          },
          {
            title: 'Test Route 2',
            description: 'Test Description 2',
            page: 'test-page-2',
            icon: 'test-icon-2',
          },
        ],
      };
    }),
  };
});

vi.mock('vue-router', () => {
  return {
    useRoute: vi.fn(() => ({
      name: 'test-page',
    })),
  };
});

describe('Header.vue', () => {
  let wrapper;

  const title = () =>
    wrapper.findComponent('[data-testid="agent-builder-header-title"]');
  const description = () =>
    wrapper.findComponent('[data-testid="agent-builder-header-description"]');
  const divider = () =>
    wrapper.findComponent('[data-testid="agent-builder-header-divider"]');
  const header = () => wrapper.find('[data-testid="agent-builder-header"]');

  const createWrapper = (props = {}) => {
    return shallowMount(Header, {
      props: {
        withDivider: true,
        actionsSize: 'md',
        ...props,
      },
      global: {
        stubs: {
          UnnnicIntelligenceText: false,
        },
      },
    });
  };

  beforeEach(() => {
    wrapper = createWrapper();
  });

  describe('Rendering', () => {
    it('should match snapshot', () => {
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders correctly with default props', () => {
      expect(header().exists()).toBe(true);
      expect(title().exists()).toBe(true);
      expect(description().exists()).toBe(true);
      expect(divider().exists()).toBe(true);
    });

    it('renders the correct title and description from brainRoutes', () => {
      expect(title().text()).toBe('Test Route');
      expect(description().text()).toBe('Test Description');
    });

    it('does not render divider when withDivider is false', async () => {
      await wrapper.setProps({ withDivider: false });
      expect(divider().exists()).toBe(false);
    });

    it('applies the correct class when actionsSize is lg', async () => {
      expect(header().classes()).not.toContain(
        'agent-builder-header--actions-lg',
      );

      await wrapper.setProps({ actionsSize: 'lg' });
      expect(header().classes()).toContain('agent-builder-header--actions-lg');
    });
  });

  describe('Props validation', () => {
    it('accepts valid actionsSize values', () => {
      const validator = Header.props.actionsSize.validator;

      expect(validator('md')).toBe(true);
      expect(validator('lg')).toBe(true);
      expect(validator('invalid')).toBe(false);
    });
  });

  describe('Slot rendering', () => {
    it('renders content in the actions slot', () => {
      const slotContent = '<button>Test Button</button>';

      wrapper = shallowMount(Header, {
        slots: {
          actions: slotContent,
        },
        global: {
          stubs: {
            UnnnicIntelligenceText: true,
            UnnnicDivider: true,
          },
        },
      });

      expect(wrapper.html()).toContain(slotContent);
    });
  });
});

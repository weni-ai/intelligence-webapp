import { mount } from '@vue/test-utils';
import PerformanceCard from '@/components/Brain/Monitoring/PerformanceCard.vue';
import i18n from '@/utils/plugins/i18n';

describe('PerformanceCard.vue', () => {
  const defaultProps = {
    title: 'Test Title',
    tooltip: 'Test Tooltip',
    value: 75.3,
    type: 'success',
    isLoading: false,
  };

  const createWrapper = (props = {}) => {
    return mount(PerformanceCard, {
      props: { ...defaultProps, ...props },
    });
  };

  describe('Rendering Elements', () => {
    it('renders correctly with default props', () => {
      const wrapper = createWrapper();
      expect(wrapper.find('[data-test="card"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="card-title"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="card-tooltip"]').exists()).toBe(true);
      expect(wrapper.find('[data-test="card-value"]').exists()).toBe(true);
    });

    it('applies the appropriate styling based on scheme prop', () => {
      const successWrapper = createWrapper({ scheme: 'green' });
      expect(successWrapper.classes()).toContain('performance-card--green');

      const failedWrapper = createWrapper({ scheme: 'red' });
      expect(failedWrapper.classes()).toContain('performance-card--red');

      const actionWrapper = createWrapper({ scheme: 'blue' });
      expect(actionWrapper.classes()).toContain('performance-card--blue');
    });

    it('renders the title correctly', () => {
      const wrapper = createWrapper({ title: 'Custom Title' });
      const title = wrapper.find('[data-test="card-title"]');
      expect(title.text()).toBe('Custom Title');
    });

    it('sets the tooltip text correctly', () => {
      const wrapper = createWrapper({ tooltip: 'Custom Tooltip' });
      const tooltip = wrapper.findComponent('[data-test="card-tooltip"]');
      expect(tooltip.props('text')).toBe('Custom Tooltip');
    });

    it('shows skeleton loader when isLoading is true', () => {
      const wrapper = createWrapper({ isLoading: true });

      const skeleton = wrapper.find('[data-test="card-value-skeleton"]');
      expect(skeleton.exists()).toBe(true);

      const value = wrapper.find('[data-test="card-value"]');
      expect(value.exists()).toBe(false);
    });

    it('shows the value when isLoading is false', () => {
      const wrapper = createWrapper({ isLoading: false });

      const skeleton = wrapper.find('[data-test="card-value-skeleton"]');
      expect(skeleton.exists()).toBe(false);

      const value = wrapper.find('[data-test="card-value"]');
      expect(value.exists()).toBe(true);
    });
  });

  describe('Number Formatting', () => {
    it('formats the value with percentage sign', () => {
      const wrapper = createWrapper({ value: 75.3 });
      const value = wrapper.find('[data-test="card-value"]');

      expect(value.text()).toMatch(/%$/);
      expect(value.text()).toContain('75');
    });

    it('formats values according to the component logic', () => {
      const formatterSpy = vi.spyOn(Intl, 'NumberFormat');

      const integerValue = 75;
      createWrapper({ value: integerValue }).find('[data-test="card-value"]');
      expect(formatterSpy).toHaveBeenCalledWith(expect.any(String), {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      });

      formatterSpy.mockClear();

      const decimalValue = 75.3;
      createWrapper({ value: decimalValue }).find('[data-test="card-value"]');
      expect(formatterSpy).toHaveBeenCalledWith(expect.any(String), {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });

      formatterSpy.mockRestore();
    });

    it('uses the current locale for number formatting', () => {
      const originalLocale = i18n.global.locale;

      const formatSpy = vi.fn().mockReturnValue('formatted-number');
      vi.spyOn(Intl, 'NumberFormat').mockImplementation(() => ({
        format: formatSpy,
      }));

      i18n.global.locale = 'en-US';
      createWrapper({ value: 1234.5 });
      expect(Intl.NumberFormat).toHaveBeenCalledWith(
        'en-US',
        expect.any(Object),
      );

      i18n.global.locale = 'pt-BR';
      createWrapper({ value: 1234.5 });
      expect(Intl.NumberFormat).toHaveBeenCalledWith(
        'pt-BR',
        expect.any(Object),
      );

      vi.mocked(Intl.NumberFormat).mockRestore();
      i18n.global.locale = originalLocale;
    });
  });
});

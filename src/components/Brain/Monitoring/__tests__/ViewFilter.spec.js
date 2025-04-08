import { beforeEach, describe } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import i18n from '@/utils/plugins/i18n';

import ViewFilter from '../ViewFilter.vue';
import { useMonitoringStore } from '@/store/Monitoring';

describe('ViewFilter.vue', () => {
  let wrapper;
  const pinia = createTestingPinia({
    initialState: {
      monitoring: {
        messages: {
          source: 'channels',
        },
      },
    },
  });
  const monitoringStore = useMonitoringStore();

  beforeEach(() => {
    wrapper = mount(ViewFilter, {
      global: {
        plugins: [pinia],
        stubs: { teleport: true },
      },
    });
  });

  const viewFilterButton = () =>
    wrapper.find('[data-testid="view-filter-button"]');

  it('render view filter button', () => {
    expect(viewFilterButton().exists()).toBe(true);
  });

  it('renders the popover with the correct title', () => {
    const popoverTitle = wrapper.find('[data-testid="popover-title"]');
    expect(popoverTitle.text()).toBe(
      i18n.global.t('router.monitoring.filters.view.title'),
    );
  });

  it('renders the radio buttons with the correct options', () => {
    const radioButtons = wrapper.findAll('[data-testid="radio-button"]');
    expect(radioButtons.length).toBe(2);
    expect(radioButtons.at(0).text()).toBe(
      i18n.global.t('router.monitoring.filters.view.channels'),
    );
    expect(radioButtons.at(1).text()).toBe(
      i18n.global.t('router.monitoring.filters.view.preview'),
    );
  });

  it('updates the view filter when a radio button is clicked', async () => {
    const radioButtons = wrapper.findAll('[data-testid="radio-button"]');
    await radioButtons.at(1).trigger('click');
    expect(wrapper.vm.viewFilter).toBe('preview');
  });

  it('updates monitoring messages source when view filter is changed', async () => {
    vi.clearAllMocks();
    wrapper.vm.viewFilter = 'preview';
    await wrapper.vm.$nextTick();

    expect(monitoringStore.updateMessagesSource).toHaveBeenCalledTimes(1);
    expect(monitoringStore.updateMessagesSource).toHaveBeenCalledWith(
      'preview',
    );
  });
});

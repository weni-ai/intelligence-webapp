import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { format, subDays } from 'date-fns';
import SupervisorHeader from '../SupervisorHeader.vue';
import { useSupervisorStore } from '@/store/Supervisor';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { createTestingPinia } from '@pinia/testing';

const pinia = createTestingPinia({
  initialState: {
    supervisor: {
      filters: {
        start: '',
        end: '',
      },
    },
    featureFlags: {
      flags: {
        supervisorExport: false,
      },
    },
  },
});

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

describe('SupervisorHeader', () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const last7Days = format(subDays(new Date(), 7), 'yyyy-MM-dd');

  let wrapper;
  let supervisorStore;
  let featureFlagsStore;

  beforeEach(() => {
    wrapper = mount(SupervisorHeader, {
      global: {
        plugins: [pinia],
      },
    });

    supervisorStore = useSupervisorStore();
    featureFlagsStore = useFeatureFlagsStore();
  });

  it('should render the component correctly', () => {
    expect(wrapper.find('[data-testid="date-picker"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="export-button"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="export-modal"]').exists()).toBe(false);
  });

  it('should set initial date filter values correctly', () => {
    const datePickerEl = wrapper.findComponent('[data-testid="date-picker"]');
    const modelValue = datePickerEl.props('modelValue');

    expect(modelValue).toEqual({
      start: last7Days,
      end: today,
    });
  });

  it('should set maxDate prop to today for date picker', () => {
    const datePickerEl = wrapper.findComponent('[data-testid="date-picker"]');

    expect(datePickerEl.props('maxDate')).toBe(today);
  });

  it('should update supervisorStore filters when date filter changes', async () => {
    const newDateFilter = {
      start: '2023-01-01',
      end: '2023-01-15',
    };

    await wrapper
      .findComponent('[data-testid="date-picker"]')
      .vm.$emit('update:modelValue', newDateFilter);

    expect(supervisorStore.filters.start).toBe(newDateFilter.start);
    expect(supervisorStore.filters.end).toBe(newDateFilter.end);
  });

  it('should not show export button when supervisorExport flag is false', () => {
    featureFlagsStore.flags.supervisorExport = false;

    expect(
      wrapper.findComponent('[data-testid="export-button"]').exists(),
    ).toBe(false);
    expect(wrapper.findComponent('[data-testid="export-modal"]').exists()).toBe(
      false,
    );
  });

  it('should set correct date filter in supervisorStore during component initialization', () => {
    expect(supervisorStore.filters.start).toBe(last7Days);
    expect(supervisorStore.filters.end).toBe(today);
  });
});

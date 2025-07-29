<template>
  <section class="supervisor-filters">
    <section class="supervisor-filters__selects">
      <UnnnicInputDatePicker
        v-model="dateFilter"
        position="left"
        class="selects__date-picker"
        :maxDate="today"
        data-testid="date-picker"
      />
      <UnnnicSelectSmart
        v-model:modelValue="statusFilter"
        :options="statusOptions"
        orderedByIndex
        multiple
        multipleWithoutSelectsMessage
        autocomplete
      />
      <UnnnicSelectSmart
        v-model:modelValue="csatFilter"
        :options="csatOptions"
        orderedByIndex
        multiple
        multipleWithoutSelectsMessage
        autocomplete
      />
      <UnnnicSelectSmart
        v-model:modelValue="subjectFilter"
        :options="subjectOptions"
        orderedByIndex
        multiple
        multipleWithoutSelectsMessage
        autocomplete
      />
    </section>

    <FilterText data-testid="filter-text" />
  </section>
</template>

<script setup>
import { ref, watch } from 'vue';

import FilterText from './FilterText.vue';
import { format } from 'date-fns';
import { useSupervisorStore } from '@/store/Supervisor';

const supervisorStore = useSupervisorStore();

const today = format(new Date(), 'yyyy-MM-dd');
function getQueryFilterArray(filter, filterOptions) {
  if (!supervisorStore.filters[filter]) return [];
  if (typeof supervisorStore.filters[filter] !== 'string')
    return supervisorStore.filters[filter];

  return supervisorStore.filters[filter]
    .split(',')
    .map((item) => filterOptions.value.find((option) => option.value === item));
}

const dateFilter = ref({
  start: supervisorStore.filters.start,
  end: supervisorStore.filters.end,
});

watch(
  () => dateFilter.value,
  () => {
    supervisorStore.filters.start = dateFilter.value.start;
    supervisorStore.filters.end = dateFilter.value.end;
  },
  { immediate: true },
);

const statusOptions = ref([
  { label: 'Conversations', value: '' },
  { label: 'Resolved', value: 'resolved' },
  { label: 'Unresolved', value: 'unresolved' },
  { label: 'Unengaged', value: 'unengaged' },
  {
    label: 'Transferred to human support',
    value: 'transferred_to_human_support',
  },
  { label: 'In Progress', value: 'in_progress' },
]);
const statusFilter = ref(getQueryFilterArray('status', statusOptions));

watch(
  () => statusFilter.value,
  () => {
    supervisorStore.filters.status = statusFilter.value.map(
      (status) => status.value,
    );
  },
  { immediate: true, deep: true },
);

const csatOptions = ref([
  { label: 'CSAT', value: '' },
  { label: '🤩 Very satisfied', value: 'very_satisfied' },
  { label: '😃 Satisfied', value: 'satisfied' },
  { label: '😐 Neutral', value: 'neutral' },
  { label: '😔 Dissatisfied', value: 'dissatisfied' },
  { label: '😡 Very dissatisfied', value: 'very_dissatisfied' },
]);
const csatFilter = ref(getQueryFilterArray('csat', csatOptions));

watch(
  () => csatFilter.value,
  () => {
    supervisorStore.filters.csat = csatFilter.value.map((csat) => csat.value);
  },
  { deep: true },
);

const subjectOptions = ref([
  { label: 'Subject', value: '' },
  { label: 'Order status', value: 'order_status' },
  { label: 'Order tracking', value: 'order_tracking' },
  { label: 'Order cancellation', value: 'order_cancellation' },
  { label: 'Product concierge', value: 'product_concierge' },
]);
const subjectFilter = ref(getQueryFilterArray('topics', subjectOptions));

watch(
  () => subjectFilter.value,
  () => {
    supervisorStore.filters.topics = subjectFilter.value.map(
      (subject) => subject.value,
    );
  },
  { immediate: true, deep: true },
);
</script>

<style scoped lang="scss">
.supervisor-filters {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  &__selects {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: $unnnic-spacing-sm;

    .selects__date-picker {
      :deep(.input) {
        width: 100%;
      }
    }
  }
}
</style>

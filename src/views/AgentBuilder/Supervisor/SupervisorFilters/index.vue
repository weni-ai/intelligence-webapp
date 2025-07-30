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
        v-model:modelValue="topicFilter"
        :options="topicOptions"
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
import { onMounted, ref, watch } from 'vue';

import FilterText from './FilterText.vue';
import { format } from 'date-fns';
import { useSupervisorStore } from '@/store/Supervisor';
import i18n from '@/utils/plugins/i18n';

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

const getStatusTranslation = (filter) =>
  i18n.global.t(`agent_builder.supervisor.filters.status.${filter}`);

const statusOptions = ref([
  { label: getStatusTranslation('conversations'), value: '' },
  { label: getStatusTranslation('resolved'), value: 'resolved' },
  { label: getStatusTranslation('unresolved'), value: 'unresolved' },
  { label: getStatusTranslation('unengaged'), value: 'unengaged' },
  {
    label: getStatusTranslation('transferred_to_human_support'),
    value: 'transferred_to_human_support',
  },
  { label: getStatusTranslation('in_progress'), value: 'in_progress' },
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

const getCsatTranslation = (filter) =>
  i18n.global.t(`agent_builder.supervisor.filters.csat.${filter}`);

const csatOptions = ref([
  { label: getCsatTranslation('csat'), value: '' },
  { label: getCsatTranslation('very_satisfied'), value: 'very_satisfied' },
  { label: getCsatTranslation('satisfied'), value: 'satisfied' },
  { label: getCsatTranslation('neutral'), value: 'neutral' },
  { label: getCsatTranslation('dissatisfied'), value: 'dissatisfied' },
  {
    label: getCsatTranslation('very_dissatisfied'),
    value: 'very_dissatisfied',
  },
]);
const csatFilter = ref(getQueryFilterArray('csat', csatOptions));

watch(
  () => csatFilter.value,
  () => {
    supervisorStore.filters.csat = csatFilter.value.map((csat) => csat.value);
  },
  { deep: true },
);

const topicOptions = ref([
  {
    label: i18n.global.t(`agent_builder.supervisor.filters.topic.topic`),
    value: '',
  },
]);
const topicFilter = ref(getQueryFilterArray('topics', topicOptions));

watch(
  () => topicFilter.value,
  () => {
    supervisorStore.filters.topics = topicFilter.value.map(
      (subject) => subject.value,
    );
  },
  { immediate: true, deep: true },
);

function getTopics() {
  supervisorStore.getTopics().then((topics) => {
    topicOptions.value = [
      ...topicOptions.value,
      ...topics.map((topic) => ({
        label: topic.name,
        value: topic.id,
      })),
    ];
  });
}

onMounted(() => {
  getTopics();
});
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

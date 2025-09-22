<template>
  <UnnnicSelectSmart
    v-model:modelValue="statusFilter"
    :options="statusOptions"
    orderedByIndex
    multiple
    multipleWithoutSelectsMessage
    autocomplete
  />
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import i18n from '@/utils/plugins/i18n';

import { useSupervisorStore } from '@/store/Supervisor';

const supervisorStore = useSupervisorStore();

function getQueryFilterArray(filter, filterOptions) {
  if (!supervisorStore.filters[filter]) return [];
  if (typeof supervisorStore.filters[filter] !== 'string')
    return supervisorStore.filters[filter];

  return supervisorStore.filters[filter].split(',').map((item) => {
    if (item === '') return { label: '', value: '' };

    return filterOptions.value.find(
      (option) => option.value === item || option.label === item,
    );
  });
}

const getStatusTranslation = (filter) =>
  i18n.global.t(`agent_builder.supervisor.filters.status.${filter}`);

const statusOptions = computed(() => [
  { label: getStatusTranslation('conversations'), value: '' },
  {
    label: getStatusTranslation('optimized_resolution'),
    value: 'optimized_resolution',
  },
  {
    label: getStatusTranslation('other_conclusion'),
    value: 'other_conclusion',
  },
  {
    label: getStatusTranslation('transferred_to_human_support'),
    value: 'transferred_to_human_support',
  },
  { label: getStatusTranslation('in_progress'), value: 'in_progress' },
  { label: getStatusTranslation('unclassified'), value: 'unclassified' },
]);
const statusFilter = ref(getQueryFilterArray('status', statusOptions));

watch(
  () => statusFilter.value,
  () => {
    supervisorStore.filters.status = statusFilter.value.map(
      (status) => status?.value || '',
    );
  },
  { immediate: true, deep: true },
);
</script>

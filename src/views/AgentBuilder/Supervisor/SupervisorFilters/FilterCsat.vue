<template>
  <UnnnicSelectSmart
    v-model:modelValue="csatFilter"
    :options="csatOptions"
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

const getCsatTranslation = (filter) =>
  i18n.global.t(`agent_builder.supervisor.filters.csat.${filter}`);

const csatOptions = computed(() => [
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
    supervisorStore.filters.csat = csatFilter.value.map(
      (csat) => csat?.value || '',
    );
  },
  { immediate: true, deep: true },
);
</script>

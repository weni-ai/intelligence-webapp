<template>
  <UnnnicSelectSmart
    v-model:modelValue="topicFilter"
    :options="topicOptions"
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

const topicOptions = computed(() => [
  {
    label: i18n.global.t(`agent_builder.supervisor.filters.topic.topic`),
    value: '',
  },
]);
const topicFilter = ref([]);

const isRequestedTopics = ref(false);

watch(
  () => topicFilter.value,
  async () => {
    if (!isRequestedTopics.value) {
      await getTopics();
      topicFilter.value = getQueryFilterArray('topics', topicOptions);
      isRequestedTopics.value = true;
    }
    supervisorStore.filters.topics = topicFilter.value.map(
      (subject) => subject?.label || '',
    );
  },
  { immediate: true, deep: true },
);

async function getTopics() {
  await supervisorStore.getTopics().then((topics) => {
    topicOptions.value = [
      ...topicOptions.value,
      ...topics.map((topic) => ({
        label: topic.name,
        value: topic.uuid,
      })),
    ];
  });
}
</script>

<template>
  <UnnnicInput
    v-model="search"
    iconLeft="search"
    :placeholder="$t('agent_builder.supervisor.search')"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash';

import { useSupervisorStore } from '@/store/Supervisor';

const supervisorStore = useSupervisorStore();

const search = ref('');

watch(
  () => search.value,
  debounce(() => {
    supervisorStore.filters.search = search.value;
    supervisorStore.loadConversations();
  }, 300),
);
</script>

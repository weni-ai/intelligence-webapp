import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import globalStore from '.';

export const useProjectStore = defineStore('Project', () => {
  const uuid = computed(() => globalStore.state.Auth.connectProjectUuid);
  const isMultiAgents = ref(false);

  async function updateIsMultiAgents(boolean) {
    isMultiAgents.value = boolean;
  }

  return {
    uuid,
    isMultiAgents,
    updateIsMultiAgents,
  };
});

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import globalStore from '.';
import nexusaiAPI from '@/api/nexusaiAPI';

export const useProjectStore = defineStore('Project', () => {
  const uuid = computed(() => globalStore.state.Auth.connectProjectUuid);
  const isMultiAgents = ref(null);
  const projectDetails = ref(null);

  async function updateIsMultiAgents(boolean) {
    isMultiAgents.value = boolean;
  }

  async function getProjectDetails() {
    const data = await nexusaiAPI.router.tunings.projectDetails.read({
      projectUuid: uuid.value,
    });

    projectDetails.value = data;
  }

  return {
    uuid,
    isMultiAgents,
    updateIsMultiAgents,
    getProjectDetails,
    projectDetails,
  };
});

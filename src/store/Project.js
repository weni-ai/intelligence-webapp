import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import globalStore from '.';
import nexusaiAPI from '@/api/nexusaiAPI';

export const useProjectStore = defineStore('Project', () => {
  const uuid = computed(() => globalStore.state.Auth.connectProjectUuid);
  const isMultiAgents = ref(null);
  const projectDetails = ref({
    status: null,
  });

  async function updateIsMultiAgents(boolean) {
    isMultiAgents.value = boolean;
  }

  async function getProjectDetails() {
    projectDetails.value.status = 'loading';

    try {
      const data = await nexusaiAPI.router.tunings.projectDetails.read({
        projectUuid: uuid.value,
      });

      projectDetails.value = data;
      projectDetails.value.status = 'success';
    } catch (error) {
      projectDetails.value.status = 'error';
    }
  }

  return {
    uuid,
    isMultiAgents,
    updateIsMultiAgents,
    getProjectDetails,
    projectDetails,
  };
});

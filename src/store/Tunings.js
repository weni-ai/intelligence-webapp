import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { cloneDeep } from 'lodash';

import globalStore from '.';
import { useAlertStore } from './Alert';

import i18n from '@/i18n';

import nexusaiAPI from '@/api/nexusaiAPI';

export const useTuningsStore = defineStore('Tunings', () => {
  const connectProjectUuid = computed(
    () => globalStore.state.Auth.connectProjectUuid,
  );

  const alertStore = useAlertStore();

  const initialCredentials = ref(null);
  const credentials = ref({
    status: null,
    data: null,
  });

  const isCredentialsValid = computed(() => {
    const allCredentials = [
      ...(credentials.value.data?.officialAgents || []),
      ...(credentials.value.data?.myAgents || []),
    ];

    const initialAllCredentials = initialCredentials.value
      ? [
          ...(initialCredentials.value?.officialAgents || []),
          ...(initialCredentials.value?.myAgents || []),
        ]
      : [];

    const hasAllCredentials =
      allCredentials.length > 0 &&
      allCredentials.every((credential) => credential.value);

    const hasChanges = allCredentials.some((credential, index) => {
      const initialCredential = initialAllCredentials[index];
      return credential.value !== initialCredential?.value;
    });

    return hasAllCredentials && hasChanges;
  });

  async function fetchCredentials() {
    if (credentials.value.data) {
      return;
    }

    try {
      credentials.value.status = 'loading';

      const { data } = await nexusaiAPI.router.tunings.listCredentials({
        projectUuid: connectProjectUuid.value,
      });

      const treatedData = {
        myAgents: data.my_agents_credentials,
        officialAgents: data.official_agents_credentials,
      };

      credentials.value.data = treatedData;
      initialCredentials.value = cloneDeep(treatedData);

      credentials.value.status = 'success';
    } catch (error) {
      credentials.value.status = 'error';
    }
  }

  async function saveCredentials() {
    try {
      credentials.value.status = 'loading';

      const { myAgents, officialAgents } = credentials.value.data;

      const formatCredentials = (credentials) =>
        credentials.reduce((acc, { name, value }) => {
          acc[name] = value;
          return acc;
        }, {});

      const credentialsToSave = {
        ...formatCredentials(myAgents),
        ...formatCredentials(officialAgents),
      };

      await nexusaiAPI.router.tunings.editCredentials({
        projectUuid: connectProjectUuid.value,
        credentials: credentialsToSave,
      });

      initialCredentials.value = cloneDeep(credentials.value.data);

      credentials.value.status = 'success';

      alertStore.add({
        text: i18n.global.t(
          'router.tunings.credentials.credentials_updated_successfully',
        ),
        type: 'success',
      });
    } catch (error) {
      credentials.value.status = 'error';
    }
  }

  return {
    credentials,
    isCredentialsValid,
    initialCredentials,
    fetchCredentials,
    saveCredentials,
  };
});

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { cloneDeep } from 'lodash';

import globalStore from '.';

import nexusaiAPI from '@/api/nexusaiAPI';

export const useTuningsStore = defineStore('Tunings', () => {
  const connectProjectUuid = computed(
    () => globalStore.state.Auth.connectProjectUuid,
  );

  const initialCredentials = ref(null);
  const credentials = ref({
    status: null,
    data: null,
  });

  function formatCredentials(credentials) {
    return credentials.reduce((acc, { name, value }) => {
      acc[name] = value;

      return acc;
    }, {});
  }

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

  function getCredentialIndex(credentialName) {
    if (!credentials.value.data) {
      credentials.value.data = {
        myAgents: [],
        officialAgents: [],
      };
    }

    const myAgentsIndex = (credentials.value.data.myAgents || []).findIndex(
      (credential) => credential.name === credentialName,
    );

    const officialAgentsIndex = (
      credentials.value.data.officialAgents || []
    ).findIndex((credential) => credential.name === credentialName);

    return [
      myAgentsIndex !== -1 ? myAgentsIndex : officialAgentsIndex,
      myAgentsIndex !== -1 ? 'myAgents' : 'officialAgents',
    ];
  }

  function updateCredentialValue(credentialName, value) {
    const [index, type] = getCredentialIndex(credentialName);

    // If credential doesn't exist, create it
    if (index === -1 || !credentials.value.data[type][index]) {
      credentials.value.data[type] = credentials.value.data[type] || [];
      credentials.value.data[type].push({
        name: credentialName,
        value: value,
      });
      return;
    }

    credentials.value.data[type][index].value = value;
  }

  async function fetchCredentials() {
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
    } catch (error) {
      credentials.value.status = 'error';
    }
  }

  async function createCredentials(agent) {
    try {
      credentials.value.status = 'loading';

      await nexusaiAPI.router.tunings.createCredentials({
        projectUuid: connectProjectUuid.value,
        credentials: formatCredentials(credentials.value.data.officialAgents),
        agent_uuid: agent.uuid,
        is_confidential: agent.is_confidential,
      });

      credentials.value.status = 'success';
    } catch (error) {
      credentials.value.status = 'error';
    }
  }

  return {
    credentials,
    isCredentialsValid,
    initialCredentials,
    getCredentialIndex,
    updateCredentialValue,
    fetchCredentials,
    saveCredentials,
    createCredentials,
  };
});

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { cloneDeep } from 'lodash';

import globalStore from '.';
import { useAlertStore } from './Alert';

import nexusaiAPI from '@/api/nexusaiAPI';
import i18n from '@/utils/plugins/i18n';

export const useTuningsStore = defineStore('Tunings', () => {
  const alertStore = useAlertStore();

  const connectProjectUuid = computed(
    () => globalStore.state.Auth.connectProjectUuid,
  );

  const isLoadingTunings = computed(() => {
    return (
      credentials.value.status === 'loading' ||
      settings.value.status === 'loading'
    );
  });

  const initialCredentials = ref(null);
  const credentials = ref({
    status: null,
    data: null,
  });

  const initialSettings = ref(null);
  const settings = ref({
    status: null,
    data: {
      components: false,
      progressiveFeedback: false,
    },
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

  const hasSettingsChanges = computed(() => {
    if (!settings.value.data || !initialSettings.value) return false;

    return (
      JSON.stringify(settings.value.data) !==
      JSON.stringify(initialSettings.value)
    );
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

  function updateCredential(credential) {
    const [index, type] = getCredentialIndex(credential.name);

    // If credential doesn't exist, create it
    if (index === -1 || !credentials.value.data[type][index]) {
      credentials.value.data[type] = credentials.value.data[type] || [];
      credentials.value.data[type].push(credential);
      return;
    }

    credentials.value.data[type][index].value = credential.value;
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

      alertStore.add({
        text: i18n.global.t('router.tunings.credentials.get_error'),
        type: 'error',
      });
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
        requestOptions: {
          hideGenericErrorAlert: true,
        },
      });

      initialCredentials.value = cloneDeep(credentials.value.data);

      credentials.value.status = 'success';
    } catch (error) {
      credentials.value.status = 'error';
    }
  }

  async function fetchSettings() {
    try {
      const { progressiveFeedback } =
        await nexusaiAPI.router.tunings.getProgressiveFeedback({
          projectUuid: connectProjectUuid.value,
        });

      const { components } = await nexusaiAPI.router.tunings.getComponents({
        projectUuid: connectProjectUuid.value,
      });

      settings.value.data = {
        components,
        progressiveFeedback,
      };
      initialSettings.value = cloneDeep(settings.value.data);

      settings.value.status = 'success';
    } catch (error) {
      settings.value.status = 'error';
    }
  }

  async function saveSettings() {
    try {
      settings.value.status = 'loading';

      const hasProgressiveFeedbackChanges =
        initialSettings.value.progressiveFeedback !==
        settings.value.data.progressiveFeedback;

      if (hasProgressiveFeedbackChanges) {
        await nexusaiAPI.router.tunings.editProgressiveFeedback({
          projectUuid: connectProjectUuid.value,
          data: {
            progressiveFeedback: settings.value.data.progressiveFeedback,
          },
          requestOptions: {
            hideGenericErrorAlert: true,
          },
        });
      }

      const hasComponentsChanges =
        initialSettings.value.components !== settings.value.data.components;

      if (hasComponentsChanges) {
        await nexusaiAPI.router.tunings.editComponents({
          projectUuid: connectProjectUuid.value,
          data: {
            components: settings.value.data.components,
          },
          requestOptions: {
            hideGenericErrorAlert: true,
          },
        });
      }

      initialSettings.value = cloneDeep(settings.value.data);
      settings.value.status = 'success';

      return true;
    } catch (error) {
      settings.value.status = 'error';
      return false;
    }
  }

  async function createCredentials(agentUuid) {
    try {
      credentials.value.status = 'loading';

      await nexusaiAPI.router.tunings.createCredentials({
        projectUuid: connectProjectUuid.value,
        credentials: credentials.value.data.officialAgents,
        agent_uuid: agentUuid,
      });

      credentials.value.status = 'success';
    } catch (error) {
      credentials.value.status = 'error';
    }
  }

  async function saveTunings() {
    let hasCredentialsError = false;
    let hasSettingsError = false;

    if (isCredentialsValid.value) {
      await saveCredentials();

      if (credentials.value.status === 'error') {
        hasCredentialsError = true;
        alertStore.add({
          text: i18n.global.t('router.tunings.credentials.save_error'),
          type: 'error',
        });
      }
    }

    if (hasSettingsChanges.value) {
      await saveSettings();

      if (settings.value.status === 'error') {
        hasSettingsError = true;
        alertStore.add({
          text: i18n.global.t('router.tunings.settings.save_error'),
          type: 'error',
        });
      }
    }

    if (!hasCredentialsError && !hasSettingsError) {
      alertStore.add({
        text: i18n.global.t('router.tunings.save_success'),
        type: 'success',
      });
    }
  }

  return {
    isLoadingTunings,
    credentials,
    settings,
    isCredentialsValid,
    hasSettingsChanges,
    initialCredentials,
    initialSettings,
    getCredentialIndex,
    updateCredential,
    fetchCredentials,
    saveCredentials,
    saveSettings,
    createCredentials,
    saveTunings,
    fetchSettings,
  };
});

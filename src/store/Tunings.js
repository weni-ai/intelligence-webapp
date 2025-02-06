import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useTuningsStore = defineStore('Tunings', () => {
  const initialCredentials = ref(null);
  const credentials = ref({
    status: null,
    data: null,
  });

  const isCredentialsValid = computed(() => {
    const hasAllCredentials = credentials.value.data?.every(
      (credential) => credential.value,
    );

    const hasChanges = credentials.value.data?.some(
      (credential) =>
        credential.value !== initialCredentials[credential.label]?.value,
    );

    return hasAllCredentials && hasChanges;
  });

  function mockedPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  async function fetchCredentials() {
    // TODO: Real request to fetch credentials

    try {
      credentials.value.status = 'loading';

      await mockedPromise();

      const data = [
        {
          label: 'BASE_URL',
          placeholder: 'https://api.vtex.com',
          value: '',
        },
        {
          label: 'VTEX_API_APPKEY',
          is_confidential: true,
          value: '',
        },
        {
          label: 'VTEX_API_APPTOKEN',
          is_confidential: true,
          value: '',
        },
      ];

      credentials.value.data = data;
      initialCredentials.value = data;

      credentials.value.status = 'success';
    } catch (error) {
      credentials.value.status = 'error';
    }
  }

  async function saveCredentials() {
    // TODO: Real request to save credentials

    try {
      credentials.value.status = 'loading';

      await mockedPromise();

      credentials.value.status = 'success';
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

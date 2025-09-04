import { defineStore } from 'pinia';
import { ref } from 'vue';

import nexusaiAPI from '@/api/nexusaiAPI';

export const useUserStore = defineStore('User', () => {
  const user = ref(null);

  async function getUserDetails() {
    try {
      const { data } = await nexusaiAPI.agent_builder.user.read();

      user.value = data;
    } catch (error) {
      console.error(error);
    }
  }

  return {
    user,
    getUserDetails,
  };
});

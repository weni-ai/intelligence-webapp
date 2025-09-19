import { defineStore } from 'pinia';
import { reactive } from 'vue';

import nexusaiAPI from '@/api/nexusaiAPI';

export const useUserStore = defineStore('UserStore', () => {
  const user = reactive({
    email: null,
    token: null,
  });

  async function getUserDetails() {
    try {
      const { data } = await nexusaiAPI.agent_builder.user.read();

      Object.assign(user, data);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    user,
    getUserDetails,
  };
});

import { defineStore } from 'pinia';
import { computed } from 'vue';

import globalStore from '.';

export const useFeatureFlagsStore = defineStore('FeatureFlags', () => {
  const isOrgEnabledForFlag = (flagKey) => {
    const orgList = runtimeVariables.get(flagKey)?.split(',') || [];
    return orgList.includes(globalStore.state.Auth.connectOrgUuid);
  };

  const flags = computed(() => ({
    agentsTeam: isOrgEnabledForFlag('VITE_FF_ORGS_WITH_AGENTS_TEAM'),
  }));

  return {
    flags,
  };
});

import { defineStore } from 'pinia';
import { computed, inject } from 'vue';

import globalStore from '.';
import { gbKey } from '../utils/Growthbook';

export const useFeatureFlagsStore = defineStore('FeatureFlags', () => {
  const growthbook = inject(gbKey);

  const getListAtEnv = (key) => {
    return runtimeVariables.get(key)?.split(',') || [];
  };

  const isOrgEnabledForFlag = (flagKey) => {
    const orgList = getListAtEnv(flagKey);
    return orgList.includes(globalStore.state.Auth.connectOrgUuid);
  };

  const isProjectEnabledForFlag = (flagKey) => {
    const projectList = getListAtEnv(flagKey);
    return projectList.includes(globalStore.state.Auth.connectProjectUuid);
  };

  const flags = computed(() => ({
    agentsTeam:
      growthbook?.isOn('agent_builder_2') ||
      isOrgEnabledForFlag('VITE_FF_ORGS_WITH_AGENTS_TEAM') ||
      isProjectEnabledForFlag('VITE_FF_PROJECTS_WITH_AGENTS_TEAM'),
  }));

  return {
    flags,
  };
});

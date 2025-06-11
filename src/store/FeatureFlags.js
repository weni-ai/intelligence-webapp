import { ref } from 'vue';
import { defineStore } from 'pinia';
import { computed, inject } from 'vue';

import globalStore from '.';
import { useProjectStore } from './Project';

import { gbKey } from '../utils/Growthbook';
import env from '@/utils/env';

export const useFeatureFlagsStore = defineStore('FeatureFlags', () => {
  const growthbook = inject(gbKey);

  const getListAtEnv = (key) => {
    return env(key)?.split(',') || [];
  };

  const isOrgEnabledForFlag = (flagKey) => {
    const orgList = getListAtEnv(flagKey);
    return orgList.includes(globalStore.state.Auth.connectOrgUuid);
  };

  const isProjectEnabledForFlag = (flagKey) => {
    const projectList = getListAtEnv(flagKey);
    return projectList.includes(globalStore.state.Auth.connectProjectUuid);
  };

  const upgradeToMultiAgents = ref(false);

  const flags = computed(() => ({
    agentsTeam:
      useProjectStore().isMultiAgents ||
      growthbook?.isOn('agent_builder_2') ||
      isOrgEnabledForFlag('FF_ORGS_WITH_AGENTS_TEAM') ||
      isProjectEnabledForFlag('FF_PROJECTS_WITH_AGENTS_TEAM'),
    upgradeToMultiAgents,
    supervisorExport: isProjectEnabledForFlag('FF_SUPERVISOR_EXPORT'),
  }));

  function editUpgradeToMultiAgents(value) {
    upgradeToMultiAgents.value = value;
  }

  return {
    flags,
    editUpgradeToMultiAgents,
  };
});

import { ref } from 'vue';
import { defineStore } from 'pinia';
import { computed, inject, watch } from 'vue';

import globalStore from '.';
import { useProjectStore } from './Project';

import { gbKey } from '../utils/Growthbook';
import env from '@/utils/env';

export const useFeatureFlagsStore = defineStore('FeatureFlags', () => {
  const growthbook = inject(gbKey);

  const currentOrgUuid = computed(
    () => globalStore?.state?.Auth?.connectOrgUuid || '',
  );

  const currentProjectUuid = computed(
    () => globalStore?.state?.Auth?.connectProjectUuid || '',
  );

  const getListAtEnv = (key) => {
    return env(key)?.split(',') || [];
  };

  const isOrgEnabledForFlag = (flagKey) => {
    const orgList = getListAtEnv(flagKey);
    return orgList.includes(currentOrgUuid.value);
  };

  const isProjectEnabledForFlag = (flagKey) => {
    const projectList = getListAtEnv(flagKey);
    return projectList.includes(currentProjectUuid.value);
  };

  const flags = computed(() => ({
    supervisorExport: isProjectEnabledForFlag('FF_SUPERVISOR_EXPORT'),
    newSupervisor: growthbook?.isOn('new_supervisor'),
  }));

  watch(
    currentOrgUuid,
    (newOrgUuid) => {
      if (newOrgUuid && growthbook) {
        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          weni_org: newOrgUuid,
        });
      }
    },
    { immediate: true },
  );

  watch(
    currentProjectUuid,
    (newProjectUuid) => {
      if (newProjectUuid && growthbook) {
        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          weni_project: newProjectUuid,
        });
      }
    },
    { immediate: true },
  );

  return {
    flags,
  };
});

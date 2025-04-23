<template>
  <section class="tunings">
    <section class="tunings__tabs">
      <UnnnicTab
        :tabs="tabs.map((e) => e.page)"
        :activeTab="activeTab"
        @change="onTabChange"
      >
        <template
          v-for="tab in tabs"
          :key="tab.page"
          #[`tab-head-${tab.page}`]
        >
          {{ $t(`router.tunings.tabs.${tab.title}`) }}
        </template>
      </UnnnicTab>
    </section>
    <section>
      <Credentials v-if="activeTab === 'credentials'" />

      <template v-if="activeTab === 'config'">
        <SettingsAgentsTeam v-if="isAgentsTeamEnabled" />
        <Settings
          v-else
          :data="props.data"
        />
      </template>

      <ChangesHistory v-if="activeTab === 'hist'" />
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useTuningsStore } from '@/store/Tunings';

import ChangesHistory from '@/components/Brain/Tunings/ChangesHistory.vue';
import Settings from '@/components/Brain/Tunings/Settings.vue';
import SettingsAgentsTeam from '@/components/Brain/Tunings/SettingsAgentsTeam/index.vue';
import Credentials from '@/components/Brain/Tunings/Credentials/index.vue';

const store = useStore();
const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;

const tabs = ref(
  [
    { title: 'config', page: 'config' },
    isAgentsTeamEnabled ? { title: 'credentials', page: 'credentials' } : null,
    { title: 'history', page: 'hist' },
  ].filter((obj) => obj),
);

const activeTab = ref('config');

const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    },
    required: false,
  },
});

onMounted(() => {
  if (isAgentsTeamEnabled) {
    useTuningsStore().fetchSettings();
  } else {
    store.dispatch('loadBrainTunings');
  }
});

const onTabChange = (newTab) => {
  activeTab.value = newTab;
};
</script>

<style lang="scss" scoped>
.tunings {
  &__tabs {
    :deep(.tab-header) {
      margin-bottom: $unnnic-spacing-md;
    }
  }
}
</style>

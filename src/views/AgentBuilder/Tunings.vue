<template>
  <BrainHeader />
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

      <Settings v-if="activeTab === 'config'" />

      <ChangesHistory v-if="activeTab === 'hist'" />
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { useTuningsStore } from '@/store/Tunings';

import BrainHeader from '@/components/Brain/BrainHeader.vue';
import ChangesHistory from '@/components/Brain/Tunings/ChangesHistory.vue';
import Settings from '@/components/Brain/Tunings/SettingsAgentsTeam/index.vue';
import Credentials from '@/components/Brain/Tunings/Credentials/index.vue';

const tabs = ref(
  [
    { title: 'config', page: 'config' },
    { title: 'credentials', page: 'credentials' },
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
  useTuningsStore().fetchSettings();
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

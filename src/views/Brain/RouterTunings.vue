<template>
  <section class="tunings__container">
    <header class="container__header">
      <UnnnicIntelligenceText
        tag="p"
        family="secondary"
        size="body-gt"
      >
        {{ $t('router.tunings.description') }}
      </UnnnicIntelligenceText>
    </header>
    <section class="container__tabs">
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
      <Settings
        v-if="activeTab === 'config'"
        :data="props.data"
      />
      <ChangesHistory v-if="activeTab === 'hist'" />
    </section>
  </section>
</template>

<script setup>
import ChangesHistory from '@/components/Brain/Tunings/ChangesHistory.vue';
import Settings from '@/components/Brain/Tunings/Settings.vue';
import Credentials from '@/components/Brain/Tunings/Credentials/index.vue';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const isAgentsTeamEnabled = useFeatureFlagsStore().flags.agentsTeam;

const tabs = ref(
  [
    isAgentsTeamEnabled
      ? { title: 'config', page: 'credentials' }
      : { title: 'config', page: 'config' },
    { title: 'history', page: 'hist' },
  ].filter((obj) => obj),
);

const activeTab = ref(isAgentsTeamEnabled ? 'credentials' : 'config');

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
  store.dispatch('loadBrainTunings');
});

const onTabChange = (newTab) => {
  activeTab.value = newTab;
};
</script>

<style lang="scss" scoped>
.tunings__container {
  .container__header {
    display: flex;
    flex-direction: column;
  }

  .container__tabs {
    margin: $unnnic-spacing-md 0 0 0;

    :deep(.tab-header) {
      margin-bottom: $unnnic-spacing-md;
    }
  }
}
</style>

<template>
  <section class="router-monitoring__performance">
    <UnnnicIntelligenceText
      tag="h2"
      family="secondary"
      size="body-lg"
      color="neutral-darkest"
      weight="bold"
      class="performance__title"
      data-test="title"
    >
      {{ $t('router.monitoring.performance') }}
    </UnnnicIntelligenceText>

    <PerformanceCard
      v-for="(answer, key) in Object.entries(answers)"
      :key="key"
      data-test="monitoring-performance-card"
      :title="answer[1].title"
      :tooltip="answer[1].tooltip"
      :value="answer[1].value"
      :scheme="getPerformanceTypeColor(answer[0])"
      :isLoading="isLoadingPerformance"
    />
  </section>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useMonitoringStore } from '@/store/Monitoring';
import i18n from '@/utils/plugins/i18n';
import PerformanceCard from '@/components/Brain/Monitoring/PerformanceCard.vue';

const monitoringStore = useMonitoringStore();
const route = useRoute();

const createAnswer = (key) => ({
  title: i18n.global.t(`router.monitoring.${key}.title`, { count: 2 }),
  tooltip: i18n.global.t(`router.monitoring.${key}.tooltip`),
  value: monitoringStore.messages.performance[key],
});

const answers = computed(() => ({
  success: createAnswer('success'),
  failed: createAnswer('failed'),
  action: createAnswer('action'),
}));

const getPerformanceTypeColor = (type) => {
  if (type === 'success') return 'green';
  if (type === 'failed') return 'red';
  return 'blue';
};

const isLoadingPerformance = computed(
  () => monitoringStore.messages.performance.status === 'loading',
);

function getMessagesPerformance() {
  monitoringStore.loadMessagesPerformance({});
}

watch(
  () => route.query,
  () => getMessagesPerformance(),
  {
    immediate: true,
  },
);

watch(
  () => monitoringStore.messages.source,
  () => getMessagesPerformance(),
);
</script>

<style lang="scss" scoped>
.router-monitoring__performance {
  display: grid;
  gap: $unnnic-spacing-sm;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr;

  .performance__title {
    grid-column: 1 / -1;
  }
}
</style>

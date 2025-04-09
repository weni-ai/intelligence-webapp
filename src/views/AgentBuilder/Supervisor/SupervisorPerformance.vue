<template>
  <section class="supervisor-performance">
    <PerformanceCard
      v-for="stat in performanceStats"
      :key="stat.title"
      data-test="monitoring-performance-card"
      :title="stat.title"
      :tooltip="stat.tooltip"
      :value="stat.value"
      :scheme="stat.scheme"
      :isLoading="supervisorStore.forwardStats.status === 'loading'"
    />
  </section>
</template>

<script setup>
import { onMounted, computed } from 'vue';

import { useSupervisorStore } from '@/store/Supervisor';

import PerformanceCard from '@/components/Brain/Monitoring/PerformanceCard.vue';
import i18n from '@/utils/plugins/i18n';

const supervisorStore = useSupervisorStore();
const t = (key) => i18n.global.t(key);

const performanceStats = computed(() => {
  const stats = supervisorStore.forwardStats.data;

  return [
    {
      title: t('agent_builder.supervisor.attended_by_agent.title'),
      tooltip: t('agent_builder.supervisor.attended_by_agent.tooltip'),
      value: stats.attendedByAgent,
      scheme: 'green',
    },
    {
      title: t('agent_builder.supervisor.forwarded_human_support.title'),
      tooltip: t('agent_builder.supervisor.forwarded_human_support.tooltip'),
      value: stats.forwardedHumanSupport,
      scheme: 'blue',
    },
  ];
});

onMounted(() => {
  supervisorStore.loadForwardStats();
});
</script>

<style lang="scss" scoped>
.supervisor-performance {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $unnnic-spacing-sm;
}
</style>

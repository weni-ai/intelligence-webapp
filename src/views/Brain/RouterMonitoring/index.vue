<template>
  <section class="router-monitoring">
    <UnnnicDivider
      data-testid="divider"
      ySpacing="md"
      class="router-monitoring__divider"
    />

    <RouterMonitoringPerformance data-testid="performance" />

    <RouterMonitoringReceivedMessages data-testid="received-messages" />
  </section>
</template>

<script setup>
import WS from '@/websocket/setup';

import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useMonitoringStore } from '@/store/Monitoring';

import RouterMonitoringPerformance from './RouterMonitoringPerformance.vue';
import RouterMonitoringReceivedMessages from './RouterMonitoringReceivedMessages/index.vue';

const ws = ref(null);
const store = useStore();
const auth = computed(() => store.state.Auth);
const monitoringStore = useMonitoringStore();

function connectMonitoringWS() {
  if (monitoringStore.ws) return;

  ws.value = new WS({
    project: auth.value.connectProjectUuid,
    token: auth.value.token.replace('Bearer ', ''),
    endpoint: 'monitoring',
  });
  ws.value.connect();

  monitoringStore.ws = ws;
}

onMounted(() => connectMonitoringWS());
</script>

<style lang="scss" scoped>
section.router-monitoring {
  display: grid;
  grid-template-rows: auto auto 1fr;
  gap: $unnnic-spacing-md;

  .router-monitoring__divider {
    margin: 0;
  }
}
</style>

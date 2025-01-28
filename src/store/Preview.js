import { defineStore } from 'pinia';

import WS from '@/websocket/setup';

import { computed, ref } from 'vue';

import globalStore from '.';

export const usePreviewStore = defineStore('preview', () => {
  const auth = computed(() => globalStore.state.Auth);

  const ws = ref(null);
  const traces = ref([]);
  const collaboratorsTraces = computed(() =>
    traces.value
      .filter((trace) => trace.type === 'trace_update')
      .map((trace) => trace.trace),
  );

  const managerAgent = ref({
    id: 1,
    name: 'Manager',
    active: true,
    currentTask: 'Coordinating team tasks',
  });

  const agents = ref([
    {
      id: 2,
      name: 'Order Analyst',
      active: true,
      currentTask: 'Working on order cancellation',
    },
    {
      id: 3,
      name: 'Credit card agent',
      active: false,
      currentTask: '',
    },
    {
      id: 4,
      name: 'Tracking agent',
      active: false,
      currentTask: '',
    },
    {
      id: 5,
      name: 'Product Concierge',
      active: false,
      currentTask: '',
    },
  ]);

  function addTrace(update) {
    traces.value.push(update);
  }

  function connectWS() {
    if (ws.value) return;

    const newWs = new WS({
      project: auth.value.connectProjectUuid,
      token: auth.value.token.replace('Bearer ', ''),
      endpoint: 'preview',
    });
    newWs.connect();

    ws.value = newWs;
  }

  function disconnectWS() {
    if (!ws.value) return;

    ws.value.disconnect();
    ws.value = null;
  }

  return {
    ws,
    connectWS,
    disconnectWS,
    agents,
    managerAgent,
    collaboratorsTraces,
    traces,
    addTrace,
  };
});

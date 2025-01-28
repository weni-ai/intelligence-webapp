import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

export const usePreviewStore = defineStore('preview', () => {
  const ws = reactive(null);
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

  return {
    ws,
    agents,
    managerAgent,
    collaboratorsTraces,
    traces,
    addTrace,
  };
});

<template>
  <UnnnicInputDatePicker
    v-model="dateFilter"
    position="right"
    class="supervisor-filter-date"
    :maxDate="today"
    data-testid="date-picker"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { format } from 'date-fns';

import { useSupervisorStore } from '@/store/Supervisor';

const supervisorStore = useSupervisorStore();

const today = format(new Date(), 'yyyy-MM-dd');
const dateFilter = ref({
  start: supervisorStore.filters.start,
  end: supervisorStore.filters.end,
});

watch(
  () => dateFilter.value,
  () => {
    supervisorStore.filters.start = dateFilter.value.start;
    supervisorStore.filters.end = dateFilter.value.end;
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.supervisor-filter-date {
  :deep(.input) {
    width: 100%;
  }
}
</style>

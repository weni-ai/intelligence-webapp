<template>
  <AgentBuilderHeader :withDivider="false">
    <template #actions>
      <UnnnicInputDatePicker
        v-model="dateFilter"
        position="right"
        class="supervisor-header__date-picker"
        :maxDate="today"
      />
    </template>
  </AgentBuilderHeader>
</template>

<script setup>
import AgentBuilderHeader from '@/components/AgentBuilder/Header.vue';

import { useSupervisorStore } from '@/store/Supervisor';

import { format, subDays } from 'date-fns';
import { ref, watch } from 'vue';

const supervisorStore = useSupervisorStore();

const last7Days = format(subDays(new Date(), 7), 'yyyy-MM-dd');
const today = format(new Date(), 'yyyy-MM-dd');

const dateFilter = ref({
  start: last7Days,
  end: today,
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
.supervisor-header {
  &__date-picker {
    :deep(.input) {
      width: 100%;
    }
  }
}
</style>

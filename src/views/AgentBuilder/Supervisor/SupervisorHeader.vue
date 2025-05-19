<template>
  <AgentBuilderHeader :withDivider="false">
    <template #actions>
      <section class="supervisor-header__actions">
        <UnnnicInputDatePicker
          v-model="dateFilter"
          position="right"
          class="supervisor-header__date-picker"
          :maxDate="today"
        />

        <UnnnicButton
          iconCenter="open_in_new"
          type="secondary"
          @click="openExportModal"
        />
      </section>

      <SupervisorExportModal v-model="isExportModalOpen" />
    </template>
  </AgentBuilderHeader>
</template>

<script setup>
import AgentBuilderHeader from '@/components/AgentBuilder/Header.vue';
import SupervisorExportModal from '@/components/AgentBuilder/Supervisor/SupervisorExportModal.vue';

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

const isExportModalOpen = ref(false);

function openExportModal() {
  isExportModalOpen.value = true;
}
</script>

<style lang="scss" scoped>
.supervisor-header {
  &__actions {
    display: flex;
    align-items: center;
    gap: $unnnic-spacing-xs;
    justify-content: flex-end;
  }

  &__date-picker {
    :deep(.input) {
      width: 100%;
    }
  }
}
</style>

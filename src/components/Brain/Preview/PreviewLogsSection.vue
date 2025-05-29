<template>
  <section
    data-testid="preview-details-logs"
    class="preview-logs-section"
  >
    <PreviewLogsFilters
      :logs="logs"
      @filters-changed="handleFiltersChanged"
    />

    <PreviewLogs
      :logs="filteredLogs"
      @scroll-to-bottom="$emit('scroll-to-bottom')"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import PreviewLogs from '@/components/Brain/PreviewLogs.vue';
import PreviewLogsFilters from '@/components/Brain/Preview/PreviewLogsFilters.vue';

const props = defineProps({
  logs: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['scroll-to-bottom']);

const searchTerm = ref('');
const selectedCategories = ref([]);
const filteredLogs = ref([]);

function handleFiltersChanged(filters) {
  searchTerm.value = filters.searchTerm;
  selectedCategories.value = filters.selectedCategories;
  filterLogs();
}

function filterLogs() {
  let filtered = props.logs;

  if (searchTerm.value.trim()) {
    const searchTermLower = searchTerm.value.toLowerCase().trim();

    filtered = filtered.filter((log) => {
      if (!log.data) return false;

      const logDataString =
        typeof log.data === 'string'
          ? log.data.toLowerCase()
          : JSON.stringify(log.data).toLowerCase();

      return logDataString.includes(searchTermLower);
    });
  }

  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter((log) =>
      selectedCategories.value.includes(log.category),
    );
  }

  filteredLogs.value = filtered;
}

onMounted(() => {
  filterLogs();
});

watch(
  () => props.logs,
  () => filterLogs(),
);
</script>

<style lang="scss" scoped>
.preview-logs-section {
  display: flex;
  flex-direction: column;
  gap: $unnnic-spacing-sm;

  height: 100%;
}
</style>

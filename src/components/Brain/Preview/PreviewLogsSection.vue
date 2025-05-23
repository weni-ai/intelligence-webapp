<template>
  <section
    data-testid="preview-details-logs"
    class="preview-logs-section"
  >
    <UnnnicFormElement
      :label="$t('router.preview.search_logs')"
      class="preview-logs-section__search"
    >
      <UnnnicInput
        v-model="searchTerm"
        :placeholder="$t('router.preview.search_logs_placeholder')"
        data-testid="logs-search-input"
        iconLeft="search"
        class="search__input"
      />
    </UnnnicFormElement>

    <PreviewLogs
      :logs="filteredLogs"
      @scroll-to-bottom="$emit('scroll-to-bottom')"
    />
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import PreviewLogs from '@/components/Brain/PreviewLogs.vue';
import { debounce } from 'lodash';

const props = defineProps({
  logs: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['scroll-to-bottom']);

const searchTerm = ref('');
const filteredLogs = ref([]);

function filterLogs() {
  if (!searchTerm.value.trim()) {
    filteredLogs.value = props.logs;
    return;
  }

  const searchTermLower = searchTerm.value.toLowerCase().trim();

  filteredLogs.value = props.logs.filter((log) => {
    if (!log.data) return false;

    const logDataString =
      typeof log.data === 'string'
        ? log.data.toLowerCase()
        : JSON.stringify(log.data).toLowerCase();

    return logDataString.includes(searchTermLower);
  });
}

onMounted(() => {
  filterLogs();
});

watch(
  () => searchTerm.value,
  debounce(() => {
    filterLogs();
  }, 300),
);

watch(
  () => props.logs,
  () => filterLogs(),
);
</script>

<style lang="scss" scoped>
.preview-logs-section {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__search {
    margin-bottom: $unnnic-spacing-md;

    .search__input {
      width: 100%;
    }
  }
}
</style>

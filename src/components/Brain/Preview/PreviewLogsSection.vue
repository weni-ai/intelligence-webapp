<template>
  <section
    data-testid="preview-details-logs"
    class="preview-logs-section"
  >
    <section class="preview-logs-section__filters">
      <header class="filters__header">
        <button
          :class="{ 'header__filter-button--expanded': showFilters }"
          class="header__filter-button"
          data-testid="filter-logs-button"
          @click="toggleFilters"
        >
          <UnnnicIntelligenceText
            color="neutral-clean"
            family="secondary"
            size="body-gt"
          >
            {{ $t('agent_builder.traces.filter_logs.title') }}
          </UnnnicIntelligenceText>

          <UnnnicIcon
            class="filter-button__icon"
            icon="keyboard_arrow_down"
            scheme="neutral-clean"
            size="avatar-nano"
            :class="{ 'filter-button__icon--expanded': showFilters }"
          />
        </button>
      </header>

      <Transition name="filters-slide">
        <section
          v-show="showFilters"
          class="filters__fields"
        >
          <UnnnicInput
            v-model="searchTerm"
            :placeholder="$t('agent_builder.traces.filter_logs.placeholder')"
            data-testid="logs-search-input"
            iconLeft="search"
            class="search__input"
          />

          <UnnnicSelectSmart
            v-model:modelValue="selectedCategories"
            :options="categoryOptions"
            autocomplete
            autocompleteClearOnFocus
            multiple
            data-testid="logs-category-filter"
          />
        </section>
      </Transition>
    </section>

    <PreviewLogs
      :logs="filteredLogs"
      @scroll-to-bottom="$emit('scroll-to-bottom')"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

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
const selectedCategories = ref([]);
const showFilters = ref(false);

const categoryOptions = computed(() => {
  const categories = new Set();

  props.logs.forEach((log) => {
    if (log.category) {
      categories.add(log.category);
    }
  });

  return Array.from(categories).map((category) => ({
    value: category,
    label: category,
  }));
});

const filteredLogs = ref([]);

function toggleFilters() {
  showFilters.value = !showFilters.value;
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
  () => searchTerm.value,
  debounce(() => {
    filterLogs();
  }, 300),
);

watch(
  () => selectedCategories.value,
  () => filterLogs(),
  { deep: true },
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
  gap: $unnnic-spacing-sm;

  &__filters {
    display: flex;
    flex-direction: column;
    gap: $unnnic-spacing-xs;

    .filters__header {
      .header__filter-button {
        border: none;
        background: none;
        padding: 0;

        cursor: pointer;

        display: flex;
        align-items: center;
        gap: $unnnic-spacing-nano;

        .filter-button__icon {
          transition: transform 0.2s ease;

          &--expanded {
            transform: rotate(180deg);
          }
        }
      }
    }

    .filters__fields {
      display: flex;
      flex-direction: column;
      gap: $unnnic-spacing-xs;

      z-index: 100;

      .filters__search,
      .filters__categories {
        .search__input {
          width: 100%;
        }
      }
    }
  }
}

.filters-slide-enter-from {
  transition: all 0.5s ease;
  transform: translateY(-5px);
  max-height: 0;
  opacity: 0;
}

.filters-slide-enter-active {
  transition: all 0.3s ease;
  transform: translateY(0);
}

.filters-slide-enter-to,
.filters-slide-leave-from {
  max-height: 200px;
  opacity: 1;
}

.filters-slide-leave-active {
  transition: all 0.3s ease;
  transform: translateY(0);
  opacity: 0;
}

.filters-slide-leave-to {
  transform: translateY(-5px);
  transition: all 0.5s ease;
  max-height: 0;
}
</style>

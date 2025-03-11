<template>
  <div>
    <div :class="['home', `page--${$route.name}`]">
      <section class="home__header">
        <div>
          <UnnnicCard
            class="home__header__icon"
            :title="$t('webapp.intelligences_lib.title')"
            icon="neurology"
            type="title"
            :hasInformationIcon="false"
            scheme="weni-600"
          />
          <div
            class="description unnnic-font secondary body-gt color-neutral-dark"
            v-html="$t('webapp.intelligences_lib.description')"
          />
        </div>

        <UnnnicButton
          class="create-ia-button"
          iconLeft="add-1"
          @click="createNewIntelligence"
        >
          {{ $t('intelligences.create_button') }}
        </UnnnicButton>
      </section>

      <UnnnicTab
        :activeTab="tab"
        size="md"
        :tabs="['content_intelligences', 'classification_intelligences']"
        @change="tab = $event"
      >
        <template #tab-head-content_intelligences>
          {{
            $t('intelligences.content_intelligences') || 'Content Intelligences'
          }}
        </template>

        <template #tab-head-classification_intelligences>
          {{
            $t('intelligences.classification_intelligences') ||
            'Classification Intelligences'
          }}
        </template>
      </UnnnicTab>

      <!-- Content Intelligences Tab -->
      <div v-show="tab === 'content_intelligences'">
        <IntelligencesFilter
          v-model:name="filterIntelligenceName"
          :showTypes="false"
          class="filters"
        />

        <EmptyIntelligencesState
          v-if="getPublicContentIntelligences.length === 0 && !contentLoading"
        />

        <div
          v-else
          class="intelligences-list"
        >
          <IntelligenceFromProjectItem
            v-for="intelligence in getPublicContentIntelligences"
            :key="intelligence.uuid"
            :project="intelligence"
          />

          <template v-if="contentLoading">
            <UnnnicSkeletonLoading
              v-for="i in 3"
              :key="i"
              tag="div"
              height="206px"
            />
          </template>

          <div
            ref="contentEndOfListElement"
            class="load-more-trigger"
          />
        </div>
      </div>

      <!-- Classification Intelligences Tab -->
      <div v-show="tab === 'classification_intelligences'">
        <ClassificationDeprecationAlert class="deprecation-alert-container" />

        <IntelligencesFilter
          v-model:name="filterIntelligenceName"
          v-model:category="filterIntelligenceCategory"
          v-model:type="ownershipFilter"
          class="filters"
        />

        <EmptyIntelligencesState
          v-if="isClassificationEmpty && !isClassificationLoading"
        />

        <div
          v-else
          class="intelligences-list"
        >
          <IntelligenceFromProjectItem
            v-for="intelligence in filteredClassificationIntelligences"
            :key="intelligence.uuid"
            :project="intelligence"
            @removed="removeIntelligence(intelligence.uuid)"
          />

          <template v-if="isClassificationLoading || contentLoading">
            <UnnnicSkeletonLoading
              v-for="i in 3"
              :key="i"
              tag="div"
              height="206px"
            />
          </template>

          <div
            ref="classificationEndOfListElement"
            class="load-more-trigger"
          ></div>
        </div>
      </div>
    </div>

    <CreateIntelligenceModal
      v-if="openModal"
      @close="openModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import CreateIntelligenceModal from '../components/repository/CreateRepository/CreateIntelligenceModal.vue';
import IntelligenceFromProjectItem from '../components/repository/home/IntelligenceFromProjectItem.vue';
import IntelligencesFilter from '../components/intelligences/IntelligencesFilter.vue';
import EmptyIntelligencesState from '../components/intelligences/EmptyIntelligencesState.vue';
import useIntelligences from '../composables/useIntelligences';
import useInfiniteScroll from '../composables/useInfiniteScroll';
import repository from '../api/repository';
import ClassificationDeprecationAlert from '../components/intelligences/ClassificationDeprecationAlert.vue';

const store = useStore();
const tab = ref('content_intelligences');
const openModal = ref(false);
const filterIntelligenceName = ref('');
const filterIntelligenceCategory = ref([]);
const ownershipFilter = ref('own');
const contentLoading = ref(false);

const {
  intelligencesState,
  isClassificationLoading,
  getFilteredClassificationIntelligences: getOwnClassificationIntelligences,
  removeIntelligence,
  loadClassificationIntelligences,
} = useIntelligences();

onMounted(() => {
  if (!store.state.Repository.publicIntelligences) {
    store.state.Repository.publicIntelligences = {
      limit: 20,
      offset: 0,
      data: [],
      next: null,
      status: null,
    };
  }

  loadInitialData();
});

const loadInitialData = async () => {
  try {
    if (tab.value === 'content_intelligences') {
      await loadPublicIntelligences();

      setTimeout(() => {
        if (
          contentEndOfListElement.value &&
          hasMoreContentPages.value &&
          getPublicContentIntelligences.value.length > 0
        ) {
          checkContentVisibility();
        }
      }, 200);
    } else {
      if (ownershipFilter.value === 'own') {
        await loadClassificationIntelligences();
        setTimeout(() => {
          if (
            classificationEndOfListElement.value &&
            filteredClassificationIntelligences.value.length > 0
          ) {
            checkClassificationVisibility();
          }
        }, 200);
      } else {
        await loadPublicIntelligences();
        setTimeout(() => {
          if (
            classificationEndOfListElement.value &&
            hasMoreClassificationPages.value &&
            filteredClassificationIntelligences.value.length > 0
          ) {
            checkClassificationVisibility();
          }
        }, 200);
      }
    }
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
};

const loadMoreContent = () => {
  if (
    tab.value === 'content_intelligences' &&
    hasMoreContentPages.value &&
    !contentLoading.value
  ) {
    loadPublicIntelligences();
  }
};

const loadMoreClassification = () => {
  if (
    tab.value !== 'classification_intelligences' ||
    isClassificationLoading.value
  ) {
    return;
  }

  console.log('Loading more classification intelligences from scroll trigger');
  if (ownershipFilter.value === 'own') {
    loadClassificationIntelligences(true);
  } else if (hasMoreClassificationPages.value) {
    loadPublicIntelligences();
  }
};

const {
  endOfListElement: contentEndOfListElement,
  checkVisibilityAndLoad: checkContentVisibility,
} = useInfiniteScroll(loadMoreContent);

const {
  endOfListElement: classificationEndOfListElement,
  checkVisibilityAndLoad: checkClassificationVisibility,
} = useInfiniteScroll(loadMoreClassification);

const getPublicContentIntelligences = computed(() => {
  if (!store.state.Repository.publicIntelligences?.data) {
    return [];
  }

  return store.state.Repository.publicIntelligences.data.filter(
    (intelligence) =>
      intelligence.repository_type === 'content' &&
      intelligence.name.toLowerCase().includes(filterIntelligenceName.value),
  );
});

const hasMoreContentPages = computed(() => {
  return !!store.state.Repository.publicIntelligences?.next;
});

const hasMoreClassificationPages = computed(() => {
  return !!store.state.Repository.publicIntelligences?.next;
});

const filteredClassificationIntelligences = computed(() => {
  if (ownershipFilter.value === 'own') {
    return getOwnClassificationIntelligences(filterIntelligenceName.value);
  } else {
    if (!store.state.Repository.publicIntelligences?.data) {
      return [];
    }

    const items = store.state.Repository.publicIntelligences.data.filter(
      (intelligence) => intelligence.repository_type === 'classifier',
    );

    return items.filter((intelligence) => {
      if (filterIntelligenceName.value) {
        return String(intelligence.name)
          .toLocaleLowerCase()
          .includes(filterIntelligenceName.value.toLowerCase());
      }
      return true;
    });
  }
});

const isClassificationEmpty = computed(() => {
  if (ownershipFilter.value === 'own') {
    return (
      intelligencesState.value.classification.fromProject.status ===
        'complete' &&
      intelligencesState.value.classification.fromOrg.status === 'complete' &&
      filteredClassificationIntelligences.value.length === 0
    );
  } else {
    const isComplete =
      store.state.Repository.publicIntelligences?.status === 'complete';
    return isComplete && filteredClassificationIntelligences.value.length === 0;
  }
});

const loadPublicIntelligences = async () => {
  if (
    contentLoading.value ||
    store.state.Repository.publicIntelligences?.status === 'loading' ||
    (store.state.Repository.publicIntelligences?.status === 'complete' &&
      !store.state.Repository.publicIntelligences?.next)
  ) {
    return;
  }

  try {
    contentLoading.value = true;
    store.state.Repository.publicIntelligences.status = 'loading';

    const { data } = await repository.listPublicIntelligences({
      next: store.state.Repository.publicIntelligences.next,
      limit: store.state.Repository.publicIntelligences.limit,
      offset: store.state.Repository.publicIntelligences.offset,
      params: {
        categories: filterIntelligenceCategory.value[0]?.label,
      },
    });

    store.state.Repository.publicIntelligences.data = [
      ...(store.state.Repository.publicIntelligences.data || []),
      ...data.results,
    ];

    store.state.Repository.publicIntelligences.next = data.next;

    if (!data.next) {
      store.state.Repository.publicIntelligences.status = 'complete';
    }
  } catch (error) {
    console.error('Error loading public intelligences:', error);
  } finally {
    contentLoading.value = false;
    if (store.state.Repository.publicIntelligences.status === 'loading') {
      store.state.Repository.publicIntelligences.status = null;
    }
  }
};

const resetPublicIntelligences = () => {
  store.state.Repository.publicIntelligences = {
    limit: 20,
    offset: 0,
    data: [],
    next: null,
    status: null,
  };
};

const createNewIntelligence = () => {
  openModal.value = true;
};

watch(tab, (newTab) => {
  if (newTab === 'content_intelligences') {
    if (!getPublicContentIntelligences.value.length) {
      loadPublicIntelligences().then(() => {
        setTimeout(() => {
          if (
            contentEndOfListElement.value &&
            hasMoreContentPages.value &&
            getPublicContentIntelligences.value.length > 0
          ) {
            checkContentVisibility();
          }
        }, 200);
      });
    } else if (hasMoreContentPages.value) {
      setTimeout(() => {
        checkContentVisibility();
      }, 200);
    }
  } else if (newTab === 'classification_intelligences') {
    if (
      ownershipFilter.value === 'own' &&
      !intelligencesState.value.classification.fromProject.data.length
    ) {
      loadClassificationIntelligences().then(() => {
        setTimeout(() => {
          if (
            classificationEndOfListElement.value &&
            filteredClassificationIntelligences.value.length > 0
          ) {
            checkClassificationVisibility();
          }
        }, 200);
      });
    } else if (
      ownershipFilter.value === 'public' &&
      !filteredClassificationIntelligences.value.length
    ) {
      loadPublicIntelligences().then(() => {
        setTimeout(() => {
          if (
            classificationEndOfListElement.value &&
            hasMoreClassificationPages.value &&
            filteredClassificationIntelligences.value.length > 0
          ) {
            checkClassificationVisibility();
          }
        }, 200);
      });
    } else {
      setTimeout(() => {
        checkClassificationVisibility();
      }, 200);
    }
  }
});

watch(ownershipFilter, () => {
  if (tab.value === 'classification_intelligences') {
    if (ownershipFilter.value === 'own') {
      if (!intelligencesState.value.classification.fromProject.data.length) {
        loadClassificationIntelligences().then(() => {
          setTimeout(() => {
            if (
              classificationEndOfListElement.value &&
              filteredClassificationIntelligences.value.length > 0
            ) {
              checkClassificationVisibility();
            }
          }, 200);
        });
      } else {
        setTimeout(() => {
          checkClassificationVisibility();
        }, 200);
      }
    } else if (!filteredClassificationIntelligences.value.length) {
      loadPublicIntelligences().then(() => {
        setTimeout(() => {
          if (
            classificationEndOfListElement.value &&
            hasMoreClassificationPages.value &&
            filteredClassificationIntelligences.value.length > 0
          ) {
            checkClassificationVisibility();
          }
        }, 200);
      });
    } else {
      setTimeout(() => {
        checkClassificationVisibility();
      }, 200);
    }
  }
});

watch(filterIntelligenceCategory, () => {
  if (tab.value === 'classification_intelligences') {
    resetPublicIntelligences();
    loadPublicIntelligences();
  }
});

watch(getPublicContentIntelligences, (newValue, oldValue) => {
  if (
    tab.value === 'content_intelligences' &&
    newValue.length > 0 &&
    newValue.length !== oldValue.length &&
    hasMoreContentPages.value
  ) {
    setTimeout(() => {
      checkContentVisibility();
    }, 200);
  }
});

watch(filteredClassificationIntelligences, (newValue, oldValue) => {
  if (
    tab.value === 'classification_intelligences' &&
    newValue.length > 0 &&
    newValue.length !== oldValue.length
  ) {
    setTimeout(() => {
      checkClassificationVisibility();
    }, 200);
  }
});
</script>

<style lang="scss" scoped>
.home__header__icon :deep(.avatar-icon) {
  background-color: $unnnic-color-weni-100;
}

.home__header__icon :deep(.title) {
  font-weight: $unnnic-font-weight-bold;
}

.create-intelligence-modal {
  :deep(.create-intelligence-modal__container) {
    padding-bottom: $unnnic-spacing-md;
  }
}

.intelligences-list {
  display: grid;
  gap: $unnnic-spacing-sm;
  grid-template-columns: repeat(
    auto-fill,
    minmax(20.625 * $unnnic-font-size, 1fr)
  );
}

.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: $unnnic-color-background-snow;

  &.page--home {
    padding: $unnnic-spacing-lg;

    .home__header {
      padding: 0;
    }

    .filters {
      padding-inline: 0;
    }
  }

  &__header {
    padding: $unnnic-inline-md;
    padding-bottom: $unnnic-spacing-stack-sm;
    margin-bottom: $unnnic-spacing-lg;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $unnnic-spacing-sm;

    .create-ia-button {
      min-width: 18.75 * $unnnic-font-size;
    }

    .description {
      margin-top: $unnnic-spacing-stack-sm;

      :deep(a) {
        text-decoration: underline;
        text-underline-offset: 3px;
        font-weight: $unnnic-font-weight-bold;
        color: inherit;
      }
    }
  }

  &__intelligences {
    margin: $unnnic-spacing-stack-sm $unnnic-spacing-stack-md
      $unnnic-spacing-stack-md;
  }
}

.home-loading {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
  padding-bottom: $unnnic-spacing-stack-sm;
  background: white;
  padding: 1.5rem 1.75rem;

  &__title {
    margin: $unnnic-spacing-inline-xs 0;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: $unnnic-spacing-inline-sm;
    height: 80px;
  }

  &__description {
    display: flex;
    justify-content: space-between;
  }

  &__cards {
    display: flex;
    justify-content: space-between;
  }
}

.hidden {
  display: none;
}

.filters {
  margin-bottom: $unnnic-spacing-md;
}

.deprecation-alert-container {
  margin-bottom: $unnnic-spacing-md;
}

:deep(.input.size-md) {
  height: auto;
}

:deep(.unnnic-modal.type-default .container) {
  max-width: 750px;
}

.load-more-trigger {
  height: 10px;
  width: 100%;
  margin-top: $unnnic-spacing-md;
  grid-column: 1 / -1;
}
</style>

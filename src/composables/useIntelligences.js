import { ref, computed } from 'vue';
import { useStore } from 'vuex';

/**
 * Composable for managing intelligence items from different sources
 * @returns {Object} Methods and state for handling intelligences
 */
export default function useIntelligences() {
  const store = useStore();

  const intelligencesState = ref({
    classification: {
      fromProject: {
        data: [],
        status: null,
      },
      fromOrg: {
        limit: 20,
        offset: 0,
        owner_id: store.getters.getOrgSelected,
        data: [],
        next: null,
        status: null,
      },
    },
  });

  /**
   * Get filtered intelligences based on name
   * @param {String} filterName - Name to filter intelligences
   * @returns {Array} Filtered intelligences
   */
  const getFilteredClassificationIntelligences = (filterName) => {
    let items = [
      ...intelligencesState.value.classification.fromProject.data,
      ...intelligencesState.value.classification.fromOrg.data.filter(
        ({ uuid }) =>
          !intelligencesState.value.classification.fromProject.data.some(
            (intelligenceFromProject) => uuid === intelligenceFromProject.uuid,
          ),
      ),
    ];

    if (!filterName) {
      return items;
    }

    return items.filter((intelligence) => {
      return String(intelligence.name)
        .toLocaleLowerCase()
        .includes(filterName.toLowerCase());
    });
  };

  /**
   * Check if the intelligence list is empty
   * @param {String} filterName - Name filter
   * @returns {Boolean} Whether the list is empty
   */
  const isClassificationListEmpty = (filterName) => {
    return (
      intelligencesState.value.classification.fromProject.status ===
        'complete' &&
      intelligencesState.value.classification.fromOrg.status === 'complete' &&
      getFilteredClassificationIntelligences(filterName).length === 0
    );
  };

  /**
   * Remove an intelligence from the project, organization and public intelligences lists
   * @param {String} intelligenceUuid - UUID of intelligence to remove
   */
  const removeIntelligence = (intelligenceUuid) => {
    intelligencesState.value.classification.fromProject.data =
      intelligencesState.value.classification.fromProject.data.filter(
        ({ uuid }) => intelligenceUuid !== uuid,
      );

    intelligencesState.value.classification.fromOrg.data =
      intelligencesState.value.classification.fromOrg.data.filter(
        ({ uuid }) => intelligenceUuid !== uuid,
      );

    if (store.state.Repository.publicIntelligences?.data) {
      store.state.Repository.publicIntelligences.data =
        store.state.Repository.publicIntelligences.data.filter(
          ({ uuid }) => intelligenceUuid !== uuid,
        );
    }
  };

  const loadIntelligencesFromProject = async () => {
    try {
      intelligencesState.value.classification.fromProject.status = 'loading';

      const { data } = await store.dispatch('searchProjectWithFlow', {
        projectUUID: store.getters.getProjectSelected,
      });

      intelligencesState.value.classification.fromProject.data = data;

      localStorage.setItem(
        'in_project',
        JSON.stringify(
          data.map(({ uuid, version_default }) => ({
            repository_uuid: uuid,
            repository_version: version_default.id,
            project_uuid: store.getters.getProjectSelected,
            organization: store.getters.getOrgSelected,
          })),
        ),
      );
    } finally {
      intelligencesState.value.classification.fromProject.status = 'complete';
    }
  };

  const loadIntelligencesFromOrg = async () => {
    try {
      intelligencesState.value.classification.fromOrg.status = 'loading';
      const fromOrg = intelligencesState.value.classification.fromOrg;

      const { data } = await store.dispatch('getRepositories', {
        limit: fromOrg.limit,
        offset: fromOrg.offset,
        owner_id: fromOrg.owner_id,
        next: fromOrg.next,
      });

      fromOrg.data = [
        ...fromOrg.data,
        ...data.results.filter(
          ({ repository_type }) => repository_type === 'classifier',
        ),
      ];

      fromOrg.next = data.next;

      if (!data.next) {
        fromOrg.status = 'complete';
      }
    } finally {
      const fromOrg = intelligencesState.value.classification.fromOrg;
      if (fromOrg.status === 'loading') {
        fromOrg.status = null;
      }
    }
  };

  const loadClassificationIntelligences = async (isEndOfList = false) => {
    const { classification } = intelligencesState.value;
    const isFirstLoad = classification?.fromProject.status === null;
    try {
      if (isFirstLoad) {
        await loadIntelligencesFromProject();
        return loadIntelligencesFromOrg();
      } else if (isEndOfList && classification?.fromOrg.status !== 'complete') {
        return loadIntelligencesFromOrg();
      }
      return Promise.resolve();
    } catch (error) {
      console.error('Error loading classification intelligences:', error);
      return Promise.reject(error);
    }
  };

  const isClassificationLoading = computed(() => {
    const { classification } = intelligencesState.value;

    return (
      classification?.fromProject.status === 'loading' ||
      classification?.fromOrg.status === 'loading'
    );
  });

  return {
    intelligencesState,
    isClassificationLoading,
    getFilteredClassificationIntelligences,
    isClassificationListEmpty,
    removeIntelligence,
    loadIntelligencesFromProject,
    loadIntelligencesFromOrg,
    loadClassificationIntelligences,
  };
}

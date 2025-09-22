import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { format, parseISO, subDays } from 'date-fns';
import globalStore from '.';
import { useAlertStore } from './Alert';
import { useRoute } from 'vue-router';

import nexusaiAPI from '@/api/nexusaiAPI';

import i18n from '@/utils/plugins/i18n';

export const useSupervisorStore = defineStore('Supervisor', () => {
  const projectUuid = computed(() => globalStore.state.Auth.connectProjectUuid);
  const supervisorApi = nexusaiAPI.agent_builder.supervisor;
  const alertStore = useAlertStore();
  const route = useRoute();
  const thisMonth = format(subDays(new Date(), 29), 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');

  const conversations = reactive({
    status: null,
    data: {
      results: [],
    },
  });

  const selectedConversation = ref(null);

  let conversationsAbortController = null;

  const defaultFilters = {
    start: thisMonth,
    end: today,
    search: '',
    status: [],
    csat: [],
    topics: [],
  };

  const filters = reactive({
    start: route?.query.start || defaultFilters.start,
    end: route?.query.end || defaultFilters.end,
    search: route?.query.search || defaultFilters.search,
    status: route?.query.status || defaultFilters.status,
    csat: route?.query.csat || defaultFilters.csat,
    topics: route?.query.topics || defaultFilters.topics,
  });

  const temporaryFilters = reactive({
    start: filters.start,
    end: filters.end,
    search: filters.search,
    status: filters.status,
    csat: filters.csat,
    topics: filters.topics,
  });

  const queryConversationUuid = ref(route?.query.uuid || '');

  function resetTemporaryFilters() {
    temporaryFilters.start = defaultFilters.start;
    temporaryFilters.end = defaultFilters.end;
    temporaryFilters.search = defaultFilters.search;
    temporaryFilters.status = defaultFilters.status;
    temporaryFilters.csat = defaultFilters.csat;
    temporaryFilters.topics = defaultFilters.topics;
  }

  function updateFilters() {
    filters.start = temporaryFilters.start;
    filters.end = temporaryFilters.end;
    filters.search = temporaryFilters.search;
    filters.status = temporaryFilters.status;
    filters.csat = temporaryFilters.csat;
    filters.topics = temporaryFilters.topics;
  }

  async function loadConversations(page = 1) {
    if (conversationsAbortController) {
      await conversationsAbortController.abort();
    }

    conversationsAbortController = new AbortController();

    conversations.status = 'loading';
    if (page === 1) conversations.data.results = [];

    const formatDateParam = (date) => format(parseISO(date), 'dd-MM-yyyy');

    try {
      const response = await supervisorApi.conversations.list({
        projectUuid: projectUuid.value,
        signal: conversationsAbortController.signal,
        hideGenericErrorAlert: true,
        filters: {
          page,
          start: formatDateParam(filters.start),
          end: formatDateParam(filters.end),
          search: filters.search,
          status: filters.status,
          csat: filters.csat,
          topics: filters.topics,
        },
      });

      conversations.status = 'complete';
      conversations.data = {
        ...response,
        results: [...conversations.data.results, ...response.results],
      };
    } catch (error) {
      if (error.code === 'ERR_CANCELED') return;

      conversations.status = 'error';
      console.error('Error loading conversations:', error);
      alertStore.add({
        type: 'error',
        text: i18n.global.t(
          'agent_builder.supervisor.load_conversations.error',
        ),
      });
    } finally {
      conversationsAbortController = null;
    }
  }

  async function loadSelectedConversationData({ next = false } = {}) {
    const conversation = selectedConversation.value;

    if (!conversation) return;
    if (conversation.data.status === 'loading') return;
    if (next && !conversation.data.next) return;

    try {
      selectedConversation.value.data.status = 'loading';

      const params = {
        projectUuid: projectUuid.value,
        start: selectedConversation.value.start,
        end: selectedConversation.value.end,
        urn: selectedConversation.value.urn,
        next: next ? selectedConversation.value.data.next : null,
      };

      const response = await supervisorApi.conversations.getById(params);

      const mergedResults = next
        ? [...response.results, ...selectedConversation.value.data.results]
        : response.results;

      selectedConversation.value.data = {
        ...selectedConversation.value.data,
        ...response,
        results: mergedResults,
        status: 'complete',
      };
    } catch (error) {
      console.error('Error loading conversation data:', error);

      if (selectedConversation.value?.data) {
        selectedConversation.value.data.status = 'error';
      }
    }
  }

  function selectConversation(uuid) {
    if (!uuid) {
      selectedConversation.value = null;
      queryConversationUuid.value = '';
      return;
    }

    if (selectedConversation.value?.uuid === uuid) return;

    const handleMatch = (conversation) => {
      return conversation.uuid === uuid;
    };

    const conversation = conversations.data.results?.find(handleMatch);

    queryConversationUuid.value = uuid;

    selectedConversation.value = {
      ...conversation,
      data: {
        status: null,
      },
    };
  }

  async function getTopics() {
    const response = await supervisorApi.conversations.getTopics({
      projectUuid: projectUuid.value,
    });
    return response;
  }

  async function exportSupervisorData({ token }) {
    try {
      await supervisorApi.conversations.export({
        hideGenericErrorAlert: true,
        projectUuid: projectUuid.value,
        token,
      });

      alertStore.add({
        type: 'success',
        text: i18n.global.t('agent_builder.supervisor.export.success'),
      });
    } catch (error) {
      alertStore.add({
        type: 'error',
        text: i18n.global.t('agent_builder.supervisor.export.error'),
      });
    }
  }

  return {
    conversations,
    loadConversations,
    loadSelectedConversationData,
    selectConversation,
    selectedConversation,
    filters,
    temporaryFilters,
    queryConversationUuid,
    getTopics,
    exportSupervisorData,
    resetTemporaryFilters,
    updateFilters,
  };
});

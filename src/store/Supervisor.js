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

  const filters = reactive({
    start: route.query.start || thisMonth,
    end: route.query.end || today,
    search: route.query.search || '',
    status: route.query.status || '',
    csat: route.query.csat || '',
    topics: route.query.topics || '',
  });

  const queryConversationUrn = ref(route.query.urn || '');

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

  function selectConversation(urn) {
    if (!urn) {
      selectedConversation.value = null;
      queryConversationUrn.value = '';
      return;
    }

    if (selectedConversation.value?.urn === urn) return;

    const handleMatch = (conversation) => {
      return conversation.urn === urn;
    };

    const conversation = conversations.data.results?.find(handleMatch);

    queryConversationUrn.value = urn;

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
    queryConversationUrn,
    getTopics,
    exportSupervisorData,
  };
});

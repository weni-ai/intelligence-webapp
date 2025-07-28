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
  const last30Days = format(subDays(new Date(), 30), 'yyyy-MM-dd');
  const today = format(new Date(), 'yyyy-MM-dd');

  const conversations = reactive({
    status: null,
    data: {
      results: [],
    },
  });

  const selectedConversation = ref(null);

  const filters = reactive({
    start: route.query.start || last30Days,
    end: route.query.end || today,
    search: route.query.search || '',
    type: route.query.type || '',
    conversationId: route.query.conversationId || '',
  });

  async function loadConversations(page = 1) {
    if (conversations.status === 'loading') {
      return;
    }

    conversations.status = 'loading';
    if (page === 1) conversations.data.results = [];

    const formatDateParam = (date) => format(parseISO(date), 'yyyy-MM-dd');

    try {
      const response = await supervisorApi.conversations.list({
        projectUuid: projectUuid.value,
        page,
        start: formatDateParam(filters.start),
        end: formatDateParam(filters.end),
        search: filters.search,
        type: filters.type,
      });

      conversations.status = 'complete';
      conversations.data = {
        ...response,
        results: [...conversations.data.results, ...response.results],
      };
    } catch (error) {
      conversations.status = 'error';
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
        start: selectedConversation.value.created_on,
        end: selectedConversation.value.end_on,
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

  function selectConversation(conversationId) {
    if (!conversationId) {
      selectedConversation.value = null;
      filters.conversationId = '';
      return;
    }

    const conversation = conversations.data.results?.find(
      (conversation) => conversation.id == conversationId,
    );

    selectedConversation.value = {
      ...conversation,
      data: {
        status: null,
      },
    };
    filters.conversationId = conversationId;
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
    exportSupervisorData,
  };
});

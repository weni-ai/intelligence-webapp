import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useSupervisorStore } from '@/store/Supervisor';
import { vi } from 'vitest';

import ConversationsTable from '../index.vue';
import i18n from '@/utils/plugins/i18n';
import { nextTick } from 'vue';

vi.mock('@/api/nexusaiAPI', () => ({
  default: {
    agent_builder: {
      supervisor: {
        conversations: {
          list: vi.fn().mockResolvedValue({
            results: [
              {
                uuid: '1',
                urn: 'conversation-123',
                created_on: '2023-05-15T14:30:00Z',
                last_message: 'This is the last message',
                human_support: false,
              },
              {
                uuid: '2',
                urn: 'conversation-456',
                created_on: '2023-05-16T10:00:00Z',
                last_message: 'Another message',
                human_support: true,
              },
            ],
            count: 2,
          }),
        },
      },
    },
  },
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn().mockReturnValue({
    query: {
      start: '2023-01-01',
      end: '2023-01-31',
      search: '',
      type: '',
      conversationId: '',
    },
  }),
}));

describe('ConversationsTable.vue', () => {
  let wrapper;
  let supervisorStore;

  const pinia = createTestingPinia({
    initialState: {
      supervisor: {
        conversations: {
          data: {
            results: [],
            count: 2,
          },
          status: 'loading',
        },
        filters: {},
      },
    },
    stubActions: false,
  });

  const table = () => wrapper.find('[data-testid="conversations-table"]');

  const conversationsCount = () =>
    wrapper.findComponent('[data-testid="conversations-count"]');

  const conversationRows = () =>
    wrapper.findAllComponents('[data-testid="conversation-row"]');

  beforeEach(() => {
    vi.clearAllMocks();

    supervisorStore = useSupervisorStore();

    supervisorStore.filters.start = '2023-01-01';
    supervisorStore.filters.end = '2023-01-31';
    supervisorStore.loadConversations();

    wrapper = shallowMount(ConversationsTable, {
      global: {
        plugins: [pinia],
        stubs: {
          UnnnicIntelligenceText: {
            template: '<div><slot /></div>',
          },
        },
      },
    });
  });

  it('renders the component correctly', () => {
    console.log(wrapper.html());
    console.log(wrapper.vm.supervisorStore.conversations);

    expect(table().exists()).toBe(true);
    // Temporaly disabled
    // expect(conversationsCount().exists()).toBe(true);
    expect(conversationRows().length).toBe(2);
  });

  it('loads conversations on mount', () => {
    expect(wrapper.vm.supervisorStore.loadConversations).toHaveBeenCalled();
  });

  // Temporaly disabled
  // it('correctly displays the conversations count', () => {
  //   expect(conversationsCount().text()).toBe(
  //     i18n.global.t('agent_builder.supervisor.conversations_count', {
  //       count: 2,
  //     }),
  //   );
  // });

  it('passes correct props to ConversationRow component', () => {
    const conversationRow = conversationRows()[0];

    expect(conversationRow.props().conversation.uuid).toBe('1');
    expect(conversationRow.props().conversation.last_message).toBe(
      'This is the last message',
    );
    expect(conversationRow.props().isSelected).toBe(false);
  });

  it('correctly handles row click', async () => {
    const conversationRow = conversationRows()[0];

    await conversationRow.trigger('click');

    expect(wrapper.vm.supervisorStore.selectedConversation).toMatchObject({
      uuid: '1',
    });
  });
});

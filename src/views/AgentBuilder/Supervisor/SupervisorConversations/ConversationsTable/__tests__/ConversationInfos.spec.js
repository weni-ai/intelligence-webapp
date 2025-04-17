import { mount } from '@vue/test-utils';

import ConversationInfos from '@/views/AgentBuilder/Supervisor/SupervisorConversations/ConversationsTable/ConversationInfos.vue';

describe('ConversationInfos.vue', () => {
  let wrapper;
  const mockUrn = 'conversation-123';
  const mockLastMessage = 'This is the last message';

  const conversationsUrn = () =>
    wrapper.findComponent('[data-testid="conversation-urn"]');
  const conversationsLastMessage = () =>
    wrapper.findComponent('[data-testid="conversation-last-message"]');

  beforeEach(() => {
    wrapper = mount(ConversationInfos, {
      props: {
        urn: mockUrn,
        lastMessage: mockLastMessage,
      },
    });
  });

  it('renders the component correctly', () => {
    expect(conversationsUrn().exists()).toBe(true);
    expect(conversationsLastMessage().exists()).toBe(true);
  });

  it('displays the urn correctly', () => {
    expect(conversationsUrn().text()).toBe(mockUrn);
  });

  it('displays the last message correctly', () => {
    expect(conversationsLastMessage().text()).toBe(mockLastMessage);
  });
});

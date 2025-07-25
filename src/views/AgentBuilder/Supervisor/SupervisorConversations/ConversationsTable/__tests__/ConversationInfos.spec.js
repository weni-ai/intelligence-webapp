import { expect } from 'vitest';
import { mount } from '@vue/test-utils';

import ConversationInfos from '@/views/AgentBuilder/Supervisor/SupervisorConversations/ConversationsTable/ConversationInfos.vue';

describe('ConversationInfos.vue', () => {
  let wrapper;
  const mockUsername = 'John Doe';
  const mockUrn = 'conversation-123';

  const conversationsUsername = () =>
    wrapper.findComponent('[data-testid="conversation-username"]');
  const conversationsUrn = () =>
    wrapper.findComponent('[data-testid="conversation-urn"]');

  beforeEach(() => {
    wrapper = mount(ConversationInfos, {
      props: {
        username: mockUsername,
        urn: mockUrn,
      },
    });
  });

  it('renders the component correctly', () => {
    expect(conversationsUrn().exists()).toBe(true);
    expect(conversationsUsername().exists()).toBe(true);
  });

  it('displays the urn correctly', () => {
    expect(conversationsUrn().text()).toBe(mockUrn);
  });

  it('displays the username correctly', () => {
    expect(conversationsUsername().text()).toBe(mockUsername);
  });

  describe('formatWhatsAppUrn Function', () => {
    const validWhatsAppFormats = [
      {
        input: 'whatsapp:5511999887766',
        expected: '+55 (11) 99988-7766',
        description: '9-digit mobile number',
      },
      {
        input: 'whatsapp:551188776655',
        expected: '+55 (11) 8877-6655',
        description: '8-digit landline number',
      },
    ];

    validWhatsAppFormats.forEach(({ input, expected, description }) => {
      it(`should format ${description} correctly`, async () => {
        await wrapper.setProps({ urn: input });

        expect(conversationsUrn().text()).toBe(expected);
      });
    });

    const nonWhatsAppUrns = [
      {
        input: 'telegram:123456789',
        description: 'telegram URN',
      },
      {
        input: 'mailto:user@example.com',
        description: 'email URN',
      },
      {
        input: 'simple-urn-123',
        description: 'plain text URN',
      },
    ];

    nonWhatsAppUrns.forEach(({ input, description }) => {
      it(`should return ${description} unchanged`, async () => {
        await wrapper.setProps({ urn: input });

        expect(conversationsUrn().text()).toBe(input);
      });
    });

    const edgeCases = [
      {
        input: 'whatsapp:123',
        expected: 'whatsapp:123',
        description: 'phone number too short',
      },
      {
        input: 'whatsapp:123456789',
        expected: 'whatsapp:123456789',
        description:
          'phone number with exactly 9 digits (less than DDI+DDD+number)',
      },
      {
        input: 'whatsapp:',
        expected: 'whatsapp:',
        description: 'WhatsApp URN with only prefix',
      },
      {
        input: '',
        expected: '',
        description: 'empty string URN',
      },
    ];

    edgeCases.forEach(({ input, expected, description }) => {
      it(`should handle ${description} gracefully`, async () => {
        await wrapper.setProps({ urn: input });

        expect(conversationsUrn().text()).toBe(expected);
      });
    });
  });
});

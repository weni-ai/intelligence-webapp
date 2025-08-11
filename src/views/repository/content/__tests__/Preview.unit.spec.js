import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from 'vuex';

import { useProfileStore } from '@/store/Profile';
import { useFlowPreviewStore } from '@/store/FlowPreview';

import nexusaiAPI from '@/api/nexusaiAPI';

import Preview from '../Preview.vue';
import i18n from '@/utils/plugins/i18n';

vi.mock('@/api/nexusaiAPI', () => ({
  default: {
    router: {
      preview: {
        create: vi.fn(),
        uploadFile: vi.fn(),
      },
    },
  },
}));

vi.stubEnv('NEXUS_API_BASE_URL', 'https://nexus.api.url');

const createMockStore = (initialState = {}, customGetters = {}) => {
  return createStore({
    state: {
      Auth: {
        connectProjectUuid: 'test-project-uuid',
      },
      router: {
        contentBaseUuid: 'test-content-base-uuid',
      },
      ...initialState,
    },
    getters: {
      isBrainSaveButtonDisabled: () => true,
      hasBrainContentTextChanged: () => false,
      ...customGetters,
    },
  });
};

describe('Preview.vue', () => {
  let wrapper;
  let profileStore;
  let flowPreviewStore;
  let store;

  const createWrapper = (
    initialState = {},
    storeState = {},
    customGetters = {},
  ) => {
    const pinia = createTestingPinia({
      initialState: {
        profile: {
          hasChanged: false,
          ...initialState.profile,
        },
        flowPreview: {
          messages: [],
          preview: {
            contact: {
              uuid: 'test-contact-uuid',
              urns: ['tel:+1234567890'],
            },
            session: null,
            quickReplies: [],
            events: [],
          },
          ...initialState.flowPreview,
        },
      },
      stubActions: false,
    });

    store = createMockStore(storeState, customGetters);

    profileStore = useProfileStore(pinia);
    flowPreviewStore = useFlowPreviewStore(pinia);

    flowPreviewStore.addMessage = vi.fn();
    flowPreviewStore.removeMessage = vi.fn();
    flowPreviewStore.treatAnswerResponse = vi.fn();
    flowPreviewStore.replaceMessage = vi.fn();
    flowPreviewStore.previewInit = vi.fn();
    flowPreviewStore.previewStart = vi.fn();
    flowPreviewStore.previewResume = vi.fn();

    return mount(Preview, {
      global: {
        plugins: [pinia, store],
        stubs: {
          PreviewMenu: true,
          PreviewPlaceholder: true,
          MessageDisplay: true,
          QuickTestWarn: true,
          MessageInput: true,
          MessageComponentResolver: true,
        },
      },
    });
  };

  const previewPlaceholder = () =>
    wrapper.findComponent('[data-testid="preview-placeholder"]');
  const messagesContainer = () =>
    wrapper.find('[data-testid="messages-container"]');
  const messageDisplays = () =>
    wrapper.findAllComponents('[data-testid="message-display"]');
  const saveWarning = () =>
    wrapper.findComponent('[data-testid="save-warning"]');
  const messageInput = () =>
    wrapper.findComponent('[data-testid="message-input"]');
  const previewMenu = () =>
    wrapper.findComponent('[data-testid="preview-menu"]');

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = createWrapper();

    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe('Component Rendering', () => {
    it('renders correctly', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('shows preview placeholder when no messages exist', () => {
      expect(previewPlaceholder().exists()).toBe(true);
      expect(messagesContainer().exists()).toBe(false);
    });

    it('shows messages container when messages exist', async () => {
      flowPreviewStore.messages = [
        { type: 'question', text: 'Hello' },
        { type: 'answer', text: 'Hi there!' },
      ];
      await nextTick();

      expect(previewPlaceholder().exists()).toBe(false);
      expect(messagesContainer().exists()).toBe(true);
    });

    it('renders message input at the bottom', () => {
      expect(messageInput().exists()).toBe(true);
      expect(messageInput().props('placeholder')).toBe(
        i18n.global.t('webapp.home.bases.preview_tests_placeholder'),
      );
    });

    it('does not show preview menu initially', () => {
      expect(previewMenu().exists()).toBe(false);
    });
  });

  describe('Message Display', () => {
    beforeEach(() => {
      flowPreviewStore.messages = [
        { type: 'question', text: 'Test question' },
        {
          type: 'answer',
          text: 'Test answer',
          response: { msg: { text: 'Test answer' } },
        },
      ];
    });

    it('renders MessageDisplay components for each message', async () => {
      await nextTick();
      expect(messageDisplays().length).toBe(2);
    });

    it('passes correct props to MessageDisplay components', async () => {
      await nextTick();
      const displays = messageDisplays();

      expect(displays[0].props('message')).toEqual(wrapper.vm.messages[0]);
      expect(displays[0].props('shouldShowSources')).toBe(true);
      expect(displays[1].props('message')).toEqual(wrapper.vm.messages[1]);
    });
  });

  describe('Save Warning', () => {
    it('shows save warning when profile has changed', async () => {
      profileStore.hasChanged = true;
      await nextTick();

      expect(saveWarning().exists()).toBe(true);
      expect(saveWarning().props('text')).toBe(
        i18n.global.t('router.preview.save_changes_to_test_the_agent'),
      );
    });

    it('shows save warning when brain save button is disabled', async () => {
      wrapper = createWrapper(
        {},
        {},
        {
          isBrainSaveButtonDisabled: () => false,
          hasBrainContentTextChanged: () => false,
        },
      );

      await nextTick();
      expect(saveWarning().exists()).toBe(true);
    });

    it('shows save warning when brain content text has changed', async () => {
      wrapper = createWrapper(
        {},
        {},
        {
          isBrainSaveButtonDisabled: () => true,
          hasBrainContentTextChanged: () => true,
        },
      );

      await nextTick();
      expect(saveWarning().exists()).toBe(true);
    });

    it('does not show save warning when no changes exist', () => {
      expect(saveWarning().exists()).toBe(false);
    });
  });

  describe('Preview Menu', () => {
    beforeEach(async () => {
      wrapper.vm.showPreviewMenu = true;
      wrapper.vm.previewMenuMessage = { text: 'Menu message' };
      await nextTick();
    });

    it('shows preview menu when showPreviewMenu is true', async () => {
      expect(previewMenu().exists()).toBe(true);
      expect(previewMenu().props('modelValue')).toBe(true);
      expect(previewMenu().props('message')).toEqual({ text: 'Menu message' });
    });

    it('hides main preview section when preview menu is shown', async () => {
      expect(previewPlaceholder().exists()).toBe(false);
      expect(messagesContainer().exists()).toBe(false);
      expect(messageInput().exists()).toBe(false);
    });

    it('handles preview menu close event', async () => {
      await previewMenu().vm.$emit('update:model-value', false);

      expect(wrapper.vm.showPreviewMenu).toBe(false);
    });

    it('handles send message event from preview menu', async () => {
      await previewMenu().vm.$emit('send-message', 'Test message');

      expect(wrapper.vm.previewMenuMessage).toBeNull();
      expect(wrapper.vm.showPreviewMenu).toBe(false);
    });

    it('handles send order event from preview menu', async () => {
      await previewMenu().vm.$emit('send-order', { product: 'test' });

      expect(wrapper.vm.showPreviewMenu).toBe(false);
      expect(flowPreviewStore.addMessage).toHaveBeenCalledWith({
        type: 'order',
        text: JSON.stringify({ product: 'test' }),
        status: 'loaded',
        question_uuid: null,
        feedback: { value: null, reason: null },
      });
    });
  });

  describe('Message Sending', () => {
    beforeEach(() => {
      wrapper.vm.message = 'Test message';
      nexusaiAPI.router.preview.create.mockResolvedValue({
        data: { type: 'broadcast', message: 'Response message' },
      });
    });

    it('adds question message to store when sending', async () => {
      await wrapper.vm.sendMessage();

      expect(flowPreviewStore.addMessage).toHaveBeenCalledWith({
        type: 'question',
        text: 'Test message',
      });
    });

    it('clears message input after sending', async () => {
      await wrapper.vm.sendMessage();
      expect(wrapper.vm.message).toBe('');
    });

    it('does not send empty message', async () => {
      wrapper.vm.message = '';
      await wrapper.vm.sendMessage();

      expect(flowPreviewStore.addMessage).not.toHaveBeenCalled();
    });

    it('does not send whitespace-only message', async () => {
      wrapper.vm.message = '   ';
      await wrapper.vm.sendMessage();

      expect(flowPreviewStore.addMessage).not.toHaveBeenCalled();
    });
  });

  describe('API Communication', () => {
    beforeEach(() => {
      nexusaiAPI.router.preview.create.mockResolvedValue({
        data: { type: 'broadcast', message: 'API response' },
      });
    });

    it('calls preview API with correct parameters', async () => {
      await wrapper.vm.answer('Test question');

      expect(nexusaiAPI.router.preview.create).toHaveBeenCalledWith({
        projectUuid: 'test-project-uuid',
        text: 'Test question',
        attachments: [],
        contact_urn: 'tel:+1234567890',
      });
    });

    it('handles API error gracefully', async () => {
      nexusaiAPI.router.preview.create.mockRejectedValue(
        new Error('API Error'),
      );

      await wrapper.vm.answer('Test question');

      expect(flowPreviewStore.removeMessage).toHaveBeenCalled();
    });

    it('handles file upload error gracefully', async () => {
      const mockFile = new File(['test'], 'test.txt');
      nexusaiAPI.router.preview.uploadFile.mockRejectedValue(
        new Error('Upload Error'),
      );

      await wrapper.vm.answer(mockFile);

      expect(flowPreviewStore.removeMessage).toHaveBeenCalled();
    });
  });

  describe('Flow Events', () => {
    it('detects brain event card correctly', () => {
      const brainEvent = {
        type: 'webhook_called',
        url: 'https://nexus.api.url/messages?token=abc123',
      };

      const result = wrapper.vm.isEventCardBrain(brainEvent);
      expect(result).toBe(true);
    });

    it('rejects non-brain events', () => {
      const nonBrainEvent = {
        type: 'other_event',
        url: 'https://other.api.url/messages',
      };

      const result = wrapper.vm.isEventCardBrain(nonBrainEvent);
      expect(result).toBe(false);
    });

    it('handles flow resume correctly', async () => {
      const answer = { type: 'answer', status: 'loading' };
      const mockEvents = [
        {
          type: 'msg_created',
          msg: { response: { msg: { text: 'Flow response' } } },
        },
      ];

      flowPreviewStore.previewResume.mockResolvedValue({
        data: { events: mockEvents },
      });

      await wrapper.vm.flowResume(answer, { text: 'Resume text' });

      expect(flowPreviewStore.previewResume).toHaveBeenCalledWith(
        'Resume text',
      );
      expect(flowPreviewStore.replaceMessage).toHaveBeenCalled();
    });

    it('handles flow start correctly', async () => {
      const answer = { type: 'answer', status: 'loading' };
      const flow = { name: 'Test Flow', uuid: 'flow-uuid', params: {} };
      const mockEvents = [
        {
          type: 'msg_created',
          msg: { response: { msg: { text: 'Flow start response' } } },
        },
      ];

      flowPreviewStore.previewStart.mockResolvedValue({
        data: { events: mockEvents },
      });

      await wrapper.vm.flowStart(answer, flow);

      expect(flowPreviewStore.previewStart).toHaveBeenCalledWith({
        flowName: 'Test Flow',
        flowUuid: 'flow-uuid',
        flowParams: {},
      });
    });
  });

  describe('Watchers', () => {
    it('emits messages when flowPreviewStore messages change', async () => {
      const newMessages = [{ type: 'question', text: 'New message' }];
      flowPreviewStore.messages = newMessages;

      await nextTick();

      expect(wrapper.emitted('messages')).toBeTruthy();
      expect(wrapper.emitted('messages')[0]).toEqual([newMessages]);
    });
  });
});

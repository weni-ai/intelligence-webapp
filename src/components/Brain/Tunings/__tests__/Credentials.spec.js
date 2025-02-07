import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';
import Credentials from '../Credentials/index.vue';
import { useTuningsStore } from '@/store/Tunings';
import Unnnic from '@weni/unnnic-system';
import i18n from '@/utils/plugins/i18n';

const mockCredentials = [
  {
    label: 'BASE_URL',
    placeholder: 'https://api.vtex.com',
    value: '',
  },
  {
    label: 'VTEX_API_APPKEY',
    is_confidential: true,
    value: '',
  },
];

describe('Credentials.vue', () => {
  let wrapper;
  let store;

  beforeEach(() => {
    wrapper = mount(Credentials, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              Tunings: {
                credentials: {
                  data: mockCredentials,
                  status: null,
                },
              },
            },
          }),
        ],

        stubs: {
          CredentialsSkeleton: true,
          UnnnicInput: true,
        },
      },
    });
    store = useTuningsStore();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render skeleton when credentials data is null', async () => {
    store.credentials.data = null;
    await nextTick();

    expect(wrapper.find('[data-testid="credentials-skeleton"]').exists()).toBe(
      true,
    );
  });

  it('should render form elements when credentials data is loaded', async () => {
    expect(
      wrapper.find('[data-testid="credentials-skeleton"]').exists(),
    ).toBeFalsy();

    const formElements = wrapper.findAll(
      '[data-testid="credentials-form-element"]',
    );
    expect(formElements).toHaveLength(2);
    expect(formElements[0].text()).toBe('BASE_URL');
    expect(formElements[1].text()).toBe('VTEX_API_APPKEY');

    const inputs = wrapper.findAll('[data-testid="credentials-form-input"]');
    expect(inputs).toHaveLength(2);

    expect(inputs[0].attributes('nativetype')).toBe('text');
    expect(inputs[0].attributes('placeholder')).toBe('https://api.vtex.com');

    expect(inputs[1].attributes('nativetype')).toBe('password');
    expect(inputs[1].attributes('placeholder')).toBe('VTEX_API_APPKEY');
  });

  it('should render save button when credentials are loaded', async () => {
    const button = wrapper.find('[data-testid="credentials-save-button"]');
    expect(button.exists()).toBeTruthy();
    expect(button.text()).toBe(i18n.global.t('save_changes'));
  });

  it('should disable save button when credentials are invalid', async () => {
    const button = wrapper.findComponent(
      '[data-testid="credentials-save-button"]',
    );
    expect(button.props('disabled')).toBeTruthy();
  });

  it('should enable save button when credentials are valid', async () => {
    store.credentials.data = [
      {
        ...mockCredentials[0],
        value: 'https://api.vtex.com',
      },
      {
        ...mockCredentials[1],
        value: '1234567890',
      },
    ];
    await nextTick();

    const button = wrapper.findComponent(
      '[data-testid="credentials-save-button"]',
    );
    expect(button.props('disabled')).toBeFalsy();
  });

  it('should show loading state in save button when saving', async () => {
    store.credentials.status = 'loading';
    await nextTick();

    const button = wrapper.findComponent(
      '[data-testid="credentials-save-button"]',
    );
    expect(button.props('loading')).toBeTruthy();
  });

  it('should call saveCredentials when save button is clicked', async () => {
    store.credentials.data = [
      {
        ...mockCredentials[0],
        value: '123',
      },
      {
        ...mockCredentials[1],
        value: '123',
      },
    ];
    await nextTick();

    const button = wrapper.findComponent(
      '[data-testid="credentials-save-button"]',
    );
    await button.trigger('click');

    expect(store.saveCredentials).toHaveBeenCalled();
  });

  it('should fetch credentials on mount', () => {
    expect(store.fetchCredentials).toHaveBeenCalled();
  });
});

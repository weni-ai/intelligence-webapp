import { flushPromises, mount, shallowMount } from '@vue/test-utils';
import { createStore } from 'vuex';
import Brain from '@/views/Brain/Brain.vue';
import RouterContentBase from '@/views/Brain/RouterContentBase.vue';
import RouterActions from '@/views/Brain/RouterActions.vue';
import RouterTunings from '@/views/Brain/RouterTunings.vue';
import ModalPreviewQRCode from '@/views/Brain/Preview/ModalPreviewQRCode.vue';
import ModalSaveChangesError from '@/views/Brain/ModalSaveChangesError.vue';
import Preview from '@/views/repository/content/Preview.vue';
import nexusaiAPI from '@/api/nexusaiAPI';
import { expect } from 'vitest';
import { useRoute } from 'vue-router';
import { createTestingPinia } from '@pinia/testing';
import { useAgentsTeamStore } from '@/store/AgentsTeam';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useFlowPreviewStore } from '@/store/FlowPreview';

const pinia = createTestingPinia({ stubActions: false });

const store = createStore({
  state() {
    return {
      Brain: {
        isSavingChanges: false,
        tabsWithError: null,
        contentText: {
          current: '',
          old: '',
        },
      },
      router: {
        contentBaseUuid: 'store-content-uuid',
        intelligenceUuid: 'store-intelligence-uuid',
      },
      Auth: {
        connectProjectUuid: 'store-connect-uuid',
      },
    };
  },
  getters: {
    isBrainSaveButtonDisabled: () => false,
  },
  actions: {
    saveBrainChanges: vi.fn(),
  },
});

vi.mock('@/views/ContentBases/filesPagination', () => ({
  useFilesPagination: vi.fn().mockReturnValue({
    loadNext: vi.fn(),
    data: [
      { id: 1, name: 'File 1' },
      { id: 2, name: 'File 2' },
    ],
  }),
}));

vi.mock('@/views/ContentBases/sitesPagination', () => ({
  useSitesPagination: vi.fn().mockReturnValue({
    loadNext: vi.fn(),
    data: [
      { id: 1, name: 'Site 1' },
      { id: 2, name: 'Site 2' },
    ],
  }),
}));

vi.mock('vue-router', () => ({
  useRoute: vi.fn(),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

vi.spyOn(nexusaiAPI.router.tunings.advanced, 'read').mockResolvedValue({
  data: {
    brain_on: false,
  },
});

vi.spyOn(nexusaiAPI, 'readIntelligenceContentBase').mockResolvedValue({
  data: {
    title: 'title',
    description: 'description',
    language: 'pt-br',
  },
});

vi.spyOn(nexusaiAPI.intelligences.contentBases.texts, 'list').mockResolvedValue(
  {
    data: {
      results: [
        {
          uuid: 'test-text-uuid',
          text: 'Sample text content',
        },
      ],
    },
  },
);

describe('Brain Component', () => {
  let wrapper;
  let agentsTeamStore;
  let featureFlagsStore;
  let flowPreviewStore;
  let pushMock;
  beforeEach(() => {
    useRoute.mockImplementationOnce(() => ({
      name: 'router-profile',
      params: {
        contentBaseUuid: 'uuuid-01',
      },
    }));

    wrapper = mount(Brain, {
      global: {
        plugins: [store, pinia],
        components: {
          RouterContentBase,
          RouterActions,
          RouterTunings,
          ModalSaveChangesError,
          Preview,
        },
        stubs: {
          RouterLink: true,
          RouterView: true,
          RouterProfile: true,
          ModalPreviewQRCode: true,
          BrainSideBar: true,
          BrainHeader: true,
          teleport: true,
        },
      },
    });

    agentsTeamStore = useAgentsTeamStore();
    featureFlagsStore = useFeatureFlagsStore();
    flowPreviewStore = useFlowPreviewStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('loads content base data correctly', async () => {
    const mockData = {
      title: 'Test Title',
      description: 'Test Description',
      language: 'en',
    };
    const mockTextData = 'Test Text';
    const mockUuid = 'test-uuid';

    nexusaiAPI.readIntelligenceContentBase.mockResolvedValue({
      data: mockData,
    });
    nexusaiAPI.intelligences.contentBases.texts.list.mockResolvedValue({
      data: {
        results: [
          {
            uuid: mockUuid,
            text: mockTextData,
          },
        ],
      },
    });

    await wrapper.vm.loadContentBase();

    expect(wrapper.vm.contentBase.title).toBe(mockData.title);
    expect(wrapper.vm.contentBase.description).toBe(mockData.description);
    expect(wrapper.vm.contentBase.language).toBe(mockData.language);
    expect(wrapper.vm.text.value).toBe(mockTextData);
    expect(wrapper.vm.text.oldValue).toBe(mockTextData);
    expect(wrapper.vm.text.uuid).toBe(mockUuid);
  });

  test('displays ModalSaveChangesError when tabsWithError is not null', async () => {
    store.state.Brain.tabsWithError = ['profile'];
    await flushPromises();
    expect(wrapper.findComponent(ModalSaveChangesError).exists()).toBe(true);
  });

  test('toggles MobilePreviewModal when corresponding dropdown item is clicked', async () => {
    wrapper.vm.isMobilePreviewModalOpen = false;
    await flushPromises();

    expect(wrapper.findComponent(ModalPreviewQRCode).exists()).toBe(false);

    const dropdownItem = wrapper.find('[data-test="View from mobile"]');

    await dropdownItem.trigger('click');
    expect(wrapper.vm.isMobilePreviewModalOpen).toBe(true);
    await flushPromises();
    expect(wrapper.findComponent(ModalPreviewQRCode).exists()).toBe(true);
  });

  test('toggles RefreshPreview when corresponding dropdown item is clicked', async () => {
    const dropdownItem = wrapper.find('[data-test="Clear conversations"]');
    await dropdownItem.trigger('click');
    expect(flowPreviewStore.clearMessages).toHaveBeenCalled();
  });

  test('check that BrainOn has the correct value after using loadRouterOptions', async () => {
    vi.spyOn(nexusaiAPI.router.tunings.advanced, 'read').mockResolvedValue({
      data: {
        brain_on: true,
      },
    });

    await wrapper.vm.loadRouterOptions();
    await flushPromises();

    expect(wrapper.vm.routerTunings.brainOn).toBe(true);
  });

  test('contentBaseUuid returns route param value if available', () => {
    useRoute.mockReturnValue({
      params: { contentBaseUuid: 'route-content-uuid' },
    });

    wrapper = mount(Brain, {
      global: {
        plugins: [store],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    });

    expect(wrapper.vm.contentBaseUuid).toBe('route-content-uuid');
  });

  test('contentBaseUuid returns store value if route param is not available', () => {
    useRoute.mockReturnValue({
      params: {},
    });

    wrapper = mount(Brain, {
      global: {
        plugins: [store],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    });

    expect(wrapper.vm.contentBaseUuid).toBe('store-content-uuid');
  });

  test('intelligenceUuid returns route param value if available', () => {
    useRoute.mockReturnValue({
      params: { intelligenceUuid: 'route-intelligence-uuid' },
    });

    wrapper = mount(Brain, {
      global: {
        plugins: [store],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    });

    expect(wrapper.vm.intelligenceUuid).toBe('route-intelligence-uuid');
  });

  test('intelligenceUuid returns store value if route param is not available', () => {
    useRoute.mockReturnValue({
      params: {},
    });

    wrapper = mount(Brain, {
      global: {
        plugins: [store],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    });

    expect(wrapper.vm.intelligenceUuid).toBe('store-intelligence-uuid');
  });

  test('handles --empty-- text case correctly', async () => {
    nexusaiAPI.intelligences.contentBases.texts.list.mockResolvedValue({
      data: {
        results: [
          {
            uuid: 'test-text-uuid',
            text: '--empty--',
          },
        ],
      },
    });

    wrapper = mount(Brain, {
      global: {
        plugins: [store],
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    });

    await flushPromises();

    expect(store.state.Brain.contentText.current).toBe('');
    expect(store.state.Brain.contentText.old).toBe('');
  });

  test('check if router components are rendered correctly based on route.name', async () => {
    const routes = [
      {
        title: 'profile',
        page: 'router-profile',
        component: 'RouterProfile',
      },
      {
        title: 'content',
        page: 'router-content',
        component: 'RouterContentBase',
      },
      { title: 'actions', page: 'router-actions', component: 'RouterActions' },
      { title: 'tunings', page: 'router-tunings', component: 'RouterTunings' },
    ];

    const componentsActive = (componentName) => {
      return wrapper.findComponent({ name: componentName }).exists();
    };

    for (const { page, component } of routes) {
      useRoute.mockImplementationOnce(() => ({
        name: page,
        params: {
          contentBaseUuid: 'uuuid-01',
        },
      }));

      wrapper = mount(Brain, {
        global: {
          plugins: [store],
          stubs: {
            RouterLink: true,
            RouterView: true,
            RouterProfile: true,
            RouterTunings: true,
            RouterActions: true,
            RouterContentBase: true,
          },
        },
      });

      await flushPromises();

      expect(componentsActive(component)).toBe(true);

      routes.forEach(({ component: otherComponent }) => {
        if (component !== otherComponent) {
          expect(componentsActive(otherComponent)).toBe(false);
        }
      });
    }
  });
});

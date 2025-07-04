import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import router from '@/router';
import store from '@/store';
import nexusaiAPI from '@/api/nexusaiAPI';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useProjectStore } from '@/store/Project';

vi.mock('@/views/Home.vue', () => ({
  default: {
    template: '<div>Home</div>',
  },
}));
vi.mock('@/views/repository/content/Bases.vue', () => ({
  default: {
    template: '<div>RepositoryContentBases</div>',
  },
}));
vi.mock('@/views/ContentBases/Form.vue', () => ({
  default: {
    template: '<div>ContentBasesForm</div>',
  },
}));
vi.mock('@/views/Brain/Brain.vue', () => ({
  default: {
    template: '<div>Brain</div>',
  },
}));
vi.mock('@/views/repository/content/ContentAdjustments.vue', () => ({
  default: {
    template: '<div>RepositoryContentAdjustment</div>',
  },
}));
vi.mock('@/views/Brain/RouterPreviewFullPage.vue', () => ({
  default: {
    template: '<div>RouterPreviewFullPage</div>',
  },
}));
vi.mock('@/views/NotFound.vue', () => ({
  default: {
    template: '<div>NotFound</div>',
  },
}));

global.window.localStorage = {
  getItem: vi.fn((key) => {
    if (key === 'authToken') return 'some-auth-token';
    return null;
  }),
  setItem: vi.fn(),
};

global.window.sessionStorage = {
  getItem: vi.fn((key) => {
    if (key === 'orgUuid') return 'some-org-uuid';
    if (key === 'projectUuid') return 'some-project-uuid';
    return null;
  }),
  setItem: vi.fn(),
};

global.window.location = {
  href: '',
  pathname: '',
};

global.location = {
  assign: vi.fn(() => {}),
};

describe('router', () => {
  let featureFlagsStore;
  let projectStore;
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(store, 'dispatch').mockImplementation(() => Promise.resolve());
    createTestingPinia();

    featureFlagsStore = useFeatureFlagsStore();
    projectStore = useProjectStore();
  });

  it('should create router with history mode', () => {
    expect(router.options.history.location).toBe(import.meta.env.BASE_URL);
  });

  it('should redirect to home if no nextPath is provided in external login', async () => {
    const to = {
      params: { token: 'token', org: 'org', project: 'project' },
      query: {},
    };
    const next = vi.fn();
    await router.options.routes[0].beforeEnter(to, null, next);
    expect(next).toHaveBeenCalledWith({
      path: '/intelligences/home',
      replace: true,
    });
  });

  it('should handle brain preview full page route correctly', async () => {
    const to = {
      query: { token: 'token', project_uuid: 'project_uuid' },
    };
    const next = vi.fn();
    await router.options.routes[3].beforeEnter(to, null, next);
    expect(store.dispatch).toHaveBeenCalledWith('externalLogin', {
      token: 'Bearer token',
    });
    expect(store.dispatch).toHaveBeenCalledWith('projectSelected', {
      project: 'project_uuid',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should handle /router route correctly', async () => {
    const data = {
      uuid: 'contentBaseUuid',
      intelligence: 'intelligenceUuid',
    };
    vi.spyOn(nexusaiAPI.router, 'read').mockResolvedValue({ data });
    vi.spyOn(nexusaiAPI.router.tunings.multiAgents, 'read').mockResolvedValue({
      data: {
        can_view: true,
        multi_agents: true,
      },
    });
    const next = vi.fn();
    await router.options.routes[4].beforeEnter({}, {}, next);
    expect(store.state.router.contentBaseUuid).toBe(data.uuid);
    expect(store.state.router.intelligenceUuid).toBe(data.intelligence);
    expect(next).toHaveBeenCalled();
  });

  it('should redirect 404 route to loginexternal', async () => {
    window.localStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'Bearer token';
      return null;
    });
    window.sessionStorage.getItem.mockImplementation((key) => {
      if (key === 'orgUuid') return 'some-org-uuid';
      if (key === 'projectUuid') return 'some-project-uuid';
      return null;
    });

    vi.stubEnv('INTELLIGENCE_LEGACY_URL', 'http://example.com');

    const to = { fullPath: '/some-path' };
    const from = {};
    const next = vi.fn();

    await router.options.routes
      .find((r) => r.name === '404')
      .beforeEnter(to, from, next);

    expect(window.location.href).toBe(
      'http://example.com/loginexternal/Bearer+token/null/some-project-uuid/?org_uuid=some-org-uuid&project_uuid=some-project-uuid&next_from_redirect=%2Fsome-path',
    );
  });

  it('should handle redirection correctly in /loginexternal route', async () => {
    const to = {
      params: { token: 'token', org: 'org', project: 'project' },
      query: { next_from_redirect: '/redirect-path' },
    };
    const next = vi.fn();

    await router.options.routes[0].beforeEnter(to, null, next);

    expect(next).toHaveBeenCalledWith({
      path: '/redirect-path',
      replace: true,
    });
  });

  it('should redirect /router to router-monitoring', async () => {
    const to = {};
    const from = {};
    const next = vi.fn();

    await router.options.routes[4].beforeEnter(to, from, next);

    expect(next).toHaveBeenCalled();
    expect(router.options.routes[4].redirect()).toStrictEqual({
      name: 'router-monitoring',
    });
  });

  it('should redirect 404 route to next()', async () => {
    const to = { fullPath: '' };
    const from = {};
    const next = vi.fn();

    await router.options.routes
      .find((r) => r.name === '404')
      .beforeEnter(to, from, next);

    expect(next).toHaveBeenCalled();
  });

  describe('Multi-agents feature flag', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should make a request to get multi-agents feature flag configuration before entering the router or agent builder route', async () => {
      const next = vi.fn();
      await router.options.routes[4].beforeEnter({}, {}, next);
      expect(nexusaiAPI.router.tunings.multiAgents.read).toHaveBeenCalledTimes(
        1,
      );

      await router.options.routes[5].beforeEnter({}, {}, next);
      expect(nexusaiAPI.router.tunings.multiAgents.read).toHaveBeenCalledTimes(
        2,
      );
    });

    it('should not make a request before entering bothub routes', async () => {
      const next = vi.fn();
      await router.options.routes[3].beforeEnter({}, {}, next);
      expect(nexusaiAPI.router.tunings.multiAgents.read).not.toHaveBeenCalled();
    });

    it('should update the multi-agents feature flag configuration when the request is successful', async () => {
      const next = vi.fn();
      await router.options.routes[4].beforeEnter({}, {}, next);
      expect(featureFlagsStore.editUpgradeToMultiAgents).toHaveBeenCalledWith(
        true,
      );
    });

    it('should not make the request if the multi-agents project field is different of null', async () => {
      projectStore.isMultiAgents = true;

      const next = vi.fn();
      await router.options.routes[4].beforeEnter({}, {}, next);

      expect(nexusaiAPI.router.tunings.multiAgents.read).not.toHaveBeenCalled();
    });
  });
});

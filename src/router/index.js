import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import AgentBuilder from '../views/AgentBuilder/index.vue';
import RepositoryContentBases from '../views/repository/content/Bases.vue';
import ContentBasesForm from '@/views/ContentBases/Form.vue';
import Brain from '../views/Brain/Brain.vue';
import RepositoryContentAdjustment from '../views/repository/content/ContentAdjustments.vue';
import RouterPreviewFullPage from '../views/Brain/RouterPreviewFullPage.vue';
import NotFound from '../views/NotFound.vue';

import store from '../store';
import { useFeatureFlagsStore } from '@/store/FeatureFlags';
import { useProjectStore } from '@/store/Project';
import { useUserStore } from '@/store/UserStore';

import nexusaiAPI from '../api/nexusaiAPI';

import env from '@/utils/env';

let nextFromRedirect = '';

const parseNextPath = (nextPath, to) => {
  const [path, queryString] = nextPath.split('?');
  const query = { ...to.query };

  if (queryString) {
    const urlParams = new URLSearchParams(queryString);
    for (const [key, value] of urlParams) {
      query[key] = value;
    }
  }

  delete query.next;
  delete query.next_from_redirect;

  return { path, query };
};

const handleLogin = async (to, from, next) => {
  const { token, org, project } = to.params;
  const { org_uuid, project_uuid } = to.query;
  const authToken = (token || localStorage.getItem('authToken')).replace(
    '+',
    ' ',
  );

  // Agent Builder 2.0
  useUserStore().user.token = authToken;
  useProjectStore().uuid = project_uuid;

  // Agent Builder 1.0 and Intelligences
  store.dispatch('externalLogin', {
    token: authToken,
  });
  store.dispatch('orgSelected', { org });
  store.dispatch('projectSelected', { project });
  store.state.Auth.connectOrgUuid = org_uuid;
  store.state.Auth.connectProjectUuid = project_uuid;
  sessionStorage.setItem('orgUuid', org_uuid);
  sessionStorage.setItem('projectUuid', project_uuid);

  const nextPath = to.query.next || to.query.next_from_redirect;

  if (nextPath) {
    const { path, query } = parseNextPath(nextPath, to);
    next({ path, query, replace: true });
  } else {
    next({ path: '/intelligences/home', replace: true });
  }
};

const getMultiAgentsEnabled = async () => {
  const projectStore = useProjectStore();

  if (projectStore.isMultiAgents !== null) return;

  const { data } = await nexusaiAPI.router.tunings.multiAgents.read({
    projectUuid: projectStore.uuid,
  });

  useFeatureFlagsStore().editUpgradeToMultiAgents(data.can_view);
  projectStore.updateIsMultiAgents(data.multi_agents);
};

const router = createRouter({
  mode: 'history',
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/loginexternal/:token/:org/:project',
      name: 'externalLogin',
      component: null,
      beforeEnter: handleLogin,
    },
    {
      path: '/:org/:project',
      name: 'iframeLogin',
      component: null,
      beforeEnter: handleLogin,
    },
    {
      path: '/intelligences/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/brain/preview',
      name: 'brain-preview-full-page',
      component: RouterPreviewFullPage,
      beforeEnter: async (to, from, next) => {
        store.dispatch('externalLogin', { token: `Bearer ${to.query?.token}` });
        store.dispatch('projectSelected', { project: to.query?.project_uuid });

        store.state.Auth.connectProjectUuid = to.query?.project_uuid;

        sessionStorage.setItem(
          'projectUuid',
          store.state.Auth.connectProjectUuid,
        );

        next();
      },
    },
    {
      path: '/router',
      name: 'router',
      component: Brain,
      redirect: () => {
        return { name: 'router-monitoring' };
      },
      async beforeEnter(_to, _from, next) {
        await getMultiAgentsEnabled();

        if (useFeatureFlagsStore().flags.agentsTeam) {
          next({ name: 'agent-builder' });
        }

        const { data } = await nexusaiAPI.router.read({
          projectUuid: store.state.Auth.connectProjectUuid,
          obstructiveErrorProducer: true,
        });

        store.state.router.contentBaseUuid = data.uuid;
        store.state.router.intelligenceUuid = data.intelligence;

        next();
      },
      children: [
        {
          path: 'monitoring',
          name: 'router-monitoring',
          component: () => import('../views/Brain/RouterMonitoring/index.vue'),
        },
        {
          path: 'profile',
          name: 'router-profile',
          component: () => import('../views/Brain/RouterProfile/index.vue'),
        },
        {
          path: 'content',
          name: 'router-content',
          component: () => import('../views/Brain/RouterContentBase.vue'),
        },
        {
          path: 'actions',
          name: 'router-actions',
          component: () => import('../views/Brain/RouterActions.vue'),
        },
        {
          path: 'tunings',
          name: 'router-tunings',
          component: () => import('../views/Brain/RouterTunings.vue'),
        },
      ],
    },
    {
      path: '/',
      name: 'agent-builder',
      component: AgentBuilder,
      redirect: (to) => {
        return { name: 'supervisor', query: to.query };
      },
      async beforeEnter(_to, _from, next) {
        await getMultiAgentsEnabled();

        if (!useFeatureFlagsStore().flags.agentsTeam) {
          next({ name: 'router' });
        }

        const { data } = await nexusaiAPI.router.read({
          projectUuid: store.state.Auth.connectProjectUuid,
          obstructiveErrorProducer: true,
        });

        store.state.router.contentBaseUuid = data.uuid;
        store.state.router.intelligenceUuid = data.intelligence;

        next();
      },
      children: [
        {
          path: 'supervisor',
          name: 'supervisor',
          component: () => import('@/views/AgentBuilder/Supervisor/index.vue'),
        },
        {
          path: 'instructions',
          name: 'instructions',
          component: () =>
            import('@/views/AgentBuilder/Instructions/index.vue'),
        },
        {
          path: 'agents',
          name: 'agents',
          component: () => import('@/views/AgentBuilder/AgentsTeam/index.vue'),
        },
        {
          path: 'knowledge',
          name: 'knowledge',
          component: () => import('@/views/AgentBuilder/Knowledge.vue'),
        },
        {
          path: 'tunings',
          name: 'tunings',
          component: () => import('@/views/AgentBuilder/Tunings.vue'),
        },
      ],
    },
    {
      path: '/intelligences/:intelligenceUuid',
      name: 'intelligence-home',
      component: RepositoryContentBases,
    },
    {
      path: '/intelligences/:intelligenceUuid/edit',
      name: 'intelligence-edit',
      component: RepositoryContentAdjustment,
    },
    {
      path: '/intelligences/:intelligenceUuid/bases/:contentBaseUuid/edit',
      name: 'intelligence-content-base-edit',
      component: ContentBasesForm,
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: NotFound,
      beforeEnter: (to, from, next) => {
        if (to.fullPath === nextFromRedirect) {
          next();
        } else {
          const bearerToken = window.localStorage
            .getItem('authToken')
            .replace(' ', '+');
          const intelligenceOrgId = store.state.Auth.org;
          const orgUuid = sessionStorage.getItem('orgUuid');
          const projectUuid = sessionStorage.getItem('projectUuid');

          const path = `/loginexternal/${bearerToken}/${intelligenceOrgId}/${projectUuid}/`;
          const redirectUrl = new URL(path, env('INTELLIGENCE_LEGACY_URL'));

          redirectUrl.searchParams.append('org_uuid', orgUuid);
          redirectUrl.searchParams.append('project_uuid', projectUuid);
          redirectUrl.searchParams.append('next_from_redirect', to.fullPath);

          location.href = redirectUrl.toString();
        }
      },
    },
  ],
});

router.afterEach((to, from) => {
  window.parent.postMessage(
    {
      event: 'changePathname',
      pathname: window.location.pathname,
    },
    '*',
  );
});

export default router;

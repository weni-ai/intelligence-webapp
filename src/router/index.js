import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import RepositoryContentBases from '../views/repository/content/Bases.vue';
import ContentBasesForm from '@/views/ContentBases/Form.vue';
import Brain from '../views/Brain/Brain.vue';
import RepositoryContentAdjustment from '../views/repository/content/ContentAdjustments.vue';
import RouterPreviewFullPage from '../views/Brain/RouterPreviewFullPage.vue';
import NotFound from '../views/NotFound.vue';

import store from '../store';
import nexusaiAPI from '../api/nexusaiAPI';

let nextFromRedirect = '';

const handleLogin = async (to, from, next) => {
  const { token, org, project } = to.params;

  store.dispatch('externalLogin', {
    token: (token || localStorage.getItem('authToken')).replace('+', ' '),
  });
  store.dispatch('orgSelected', { org });
  store.dispatch('projectSelected', { project });

  store.state.Auth.connectOrgUuid = to.query?.org_uuid;
  store.state.Auth.connectProjectUuid = to.query?.project_uuid;

  sessionStorage.setItem('orgUuid', store.state.Auth.connectOrgUuid);
  sessionStorage.setItem('projectUuid', store.state.Auth.connectProjectUuid);

  const nextPath = to.query.next || to.query.next_from_redirect;

  if (nextPath) {
    next({ path: nextPath, replace: true });
  } else {
    next({ path: '/home', replace: true });
  }
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
      path: '/home',
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
          path: 'agents-team',
          name: 'router-agents-team',
          component: () => import('../views/Brain/RouterAgentsTeam/index.vue'),
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
          const redirectUrl = new URL(
            path,
            runtimeVariables.get('INTELLIGENCE_LEGACY_URL'),
          );

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

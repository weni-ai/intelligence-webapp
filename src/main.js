import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as Sentry from '@sentry/vue';
import Particles from '@tsparticles/vue3';
import { loadSlim } from '@tsparticles/slim';

import App from './App.vue';
import router from './router';
import { store } from './store';
import i18n from './utils/plugins/i18n';
import iframessa from 'iframessa';
import UnnnicDivider from './components/Divider.vue';
import UnnnicIntelligenceHeader from './components/unnnic-intelligence/Header.vue';
import UnnnicIntelligenceText from './components/unnnic-intelligence/Text.vue';
import UnnnicSystemPlugin from './utils/UnnnicSystemPlugin.js';
import { gbKey, initializeGrowthBook } from './utils/Growthbook';
import { getJwtToken } from './utils/jwt';
import './utils/HandlerObstructiveError.js';
import hotjarInit from '@/utils/plugins/Hotjar';
import env from './utils/env';

getJwtToken().then(() => {
  initializeGrowthBook().then((gbInstance) => {
    iframessa.register('ai');

    hotjarInit();

    const pinia = createPinia();
    const app = createApp(App);

    app.use(store).use(pinia).use(router).use(UnnnicSystemPlugin).use(i18n);

    app.use(Particles, {
      init: async (engine) => {
        await loadSlim(engine);
      },
    });

    if (env('VITE_BOTHUB_WEBAPP_SENTRY')) {
      Sentry.init({
        app,
        dsn: env('VITE_BOTHUB_WEBAPP_SENTRY'),
        environment: env('SENTRY_ENVIRONMENT'),
        integrations: [
          Sentry.browserTracingIntegration({ router }),
          Sentry.replayIntegration(),
        ],
        tracesSampleRate: 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        trackComponents: true,
        beforeSend: (event) => {
          if (window.location.hostname === 'localhost') {
            return null;
          }

          return event;
        },
      });
    }

    app.component('UnnnicDivider', UnnnicDivider);
    app.component('UnnnicIntelligenceHeader', UnnnicIntelligenceHeader);
    app.component('UnnnicIntelligenceText', UnnnicIntelligenceText);

    app.provide(gbKey, gbInstance);
    app.mount('#app');
  });
});

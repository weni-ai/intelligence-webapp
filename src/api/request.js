import axios from 'axios';
import * as Sentry from '@sentry/browser';
import store from '../store';
import env from '@/utils/env';

export default {
  get $http() {
    const client = axios.create({
      baseURL: env('API_BASE_URL'),
      headers: {
        ...(store.getters.authenticated
          ? { Authorization: `${store.getters.authToken}` }
          : {}),
      },
    });
    client.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response.status === 500 || err.response.status === 408) {
          Sentry.captureException(err);
        }
        throw err;
      },
    );
    return client;
  },
};

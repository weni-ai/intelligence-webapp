import { createHttpClient } from './httpClientFactory';

export default {
  get $http() {
    return createHttpClient('VITE_NEXUS_API_BASE_URL');
  },
};

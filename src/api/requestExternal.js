import env from '@/utils/env';
import axios from 'axios';

export default {
  $http(token) {
    return axios.create({
      baseURL: env('VITE_API_BASE_URL'),
      headers: {
        ...(token ? { Authorization: `Translator ${token}` } : {}),
      },
    });
  },
};

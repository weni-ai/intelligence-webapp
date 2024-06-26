import qs from '../utils/QueryString.js';

import request from './request';
import utils from './utils';

export default {
  profile(nickname) {
    return request.$http.get(`v2/account/user-profile/${nickname}/`);
  },
  org_profile(nickname) {
    return request.$http.get(`v2/org/profile/${nickname}/`);
  },
  myProfile({ obstructiveErrorProducer }) {
    return request.$http.get('/v2/account/my-profile/', {
      obstructiveErrorProducer,
    });
  },
  searchByOwner(limit, offset, owner_id, next) {
    if (next) {
      return request.$http.get(next);
    }

    return request.$http.get('/v2/repository/search-repositories/', {
      params: {
        limit,
        offset,
        owner_id,
        next,
      },
    });
  },
  permissionRepositories() {
    return request.$http.get('/v2/repository/repositories-permissions/');
  },
  async getMyProfileSchema() {
    const { data } = await request.$http.options('/v2/account/my-profile/');
    return data.actions.PUT;
  },
  updateMyProfile(nickname, email, name, locale, biography = '') {
    return request.$http.put('/v2/account/my-profile/', {
      nickname,
      email,
      name,
      locale,
      biography,
    });
  },
  // TODO
  getPaymentHistory(limit = 10) {
    return new utils.Page('', limit);
  },
  async getChangePasswordSchema() {
    const { data } = await request.$http.options(
      '/v2/account/change-password/',
    );
    return data.actions.PUT;
  },
  changePassword(currentPassword, password) {
    return request.$http.put('/v2/account/change-password/', {
      current_password: currentPassword,
      password,
    });
  },
  search(query) {
    const queryString = qs.stringify(query);
    return request.$http.get(`/v2/account/search-user/?${queryString}`);
  },

  getReports(startDate, endDate, limit = 20) {
    return new utils.Page('/v2/repository/repository-reports/', limit, {
      start_date: startDate,
      end_date: endDate,
    });
  },
};

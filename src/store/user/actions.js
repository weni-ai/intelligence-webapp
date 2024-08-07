import * as Sentry from '@sentry/vue';
import user from '@/api/user';
import TYPES from '../types';

export default {
  async updateMyProfile({ commit, dispatch, getters }) {
    if (!getters.authenticated) {
      commit(TYPES.SET_NICKNAME_AUTHENTICATED, { nickname: null });
    } else {
      try {
        const response = await user.myProfile();
        commit(TYPES.SET_PROFILE, {
          nickname: response.data.nickname,
          data: response.data,
          lastUpdate: Date.now(),
        });
        commit(TYPES.SET_NICKNAME_AUTHENTICATED, {
          nickname: response.data.nickname,
        });
      } catch (error) {
        /* istanbul ignore next */
        dispatch('logout');
      }
    }
  },
  async updateProfile({ commit, getters }, { nickname, forced, isOrg }) {
    const lastUpdate = getters.getProfileLastUpdate(nickname);
    const profileVersionValidUntil = lastUpdate + 30 * 1000;
    if (profileVersionValidUntil < Date.now() || forced) {
      commit(TYPES.SET_PROFILE, {
        nickname,
        lastUpdate: Date.now(),
      });
      const response = isOrg
        ? await user.org_profile(nickname)
        : await user.profile(nickname);
      commit(TYPES.SET_PROFILE, {
        nickname,
        data: response.data,
        lastUpdate: Date.now(),
      });
    }
  },
  setUserName({ commit }, username) {
    commit(TYPES.SET_USERNAME, {
      username,
    });
  },
  getPaymentHistory(store, limit = 20) {
    return user.getPaymentHistory(limit);
  },
  getRepositories(store, { limit, offset, owner_id, next }) {
    /* istanbul ignore next */
    return user.searchByOwner(limit, offset, owner_id, next);
  },
  getContributingRepositories(store) {
    /* istanbul ignore next */
    return user.permissionRepositories();
  },
  getUserReports(store, { startDate, endDate, limit = 20 }) {
    return user.getReports(startDate, endDate, limit);
  },
  async getMyProfileSchema(nickname) {
    const schema = await user.getMyProfileSchema(nickname);
    return schema;
  },
  patchMyProfile(store, { nickname, email, name, locale, biography }) {
    return user.updateMyProfile(nickname, email, name, locale, biography);
  },
  async getChangePasswordSchema() {
    const schema = await user.getChangePasswordSchema();
    return schema;
  },
  changePassword(store, { current_password: currentPassword, password }) {
    return user.changePassword(currentPassword, password);
  },
  searchUser(store, query) {
    return user.search(query);
  },
  async getMyProfileInfo() {
    const response = await user.myProfile({ obstructiveErrorProducer: true });

    const { nickname, name, language, locale } = response.data;

    Sentry.setUser({ username: nickname, name, language, locale });

    return response;
  },
};

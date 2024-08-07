import auth from '@/api/auth';
import TYPES from '../types';

export default {
  async getLoginSchema() {
    const response = await auth.getLoginSchema();
    return response;
  },
  async login({ commit, dispatch }, { username, password }) {
    const response = await auth.login(username, password);
    commit(TYPES.SET_TOKEN, `Token ${response.data.token}`);
    dispatch('updateMyProfile');
  },
  async externalLogin({ commit }, { token }) {
    if (!token) return;
    commit(TYPES.SET_TOKEN, token);
  },
  async orgSelected({ commit }, { org }) {
    if (!org) return;
    commit(TYPES.SET_ORG, org);
  },
  async projectSelected({ commit }, { project }) {
    if (!project) return;
    commit(TYPES.SET_PROJECT, project);
  },
  retriveAuthToken({ commit }) {
    /* istanbul ignore next */
    if (window.localStorage) {
      commit(TYPES.SET_TOKEN, window.localStorage.getItem('authToken'));
    }
  },
  logout({ commit, dispatch }) {
    commit(TYPES.SET_TOKEN, null);
    dispatch('updateMyProfile');
  },
  async getForgotPasswordSchema() {
    const response = await auth.getForgotPasswordSchema();
    return response;
  },
  async forgotPassword(store, { email }) {
    await auth.forgotPassword(email);
  },
  async getResetPasswordSchema(store, { nickname }) {
    const response = await auth.getResetPasswordSchema(nickname);
    return response;
  },
  async resetPassword(store, { nickname, token, password }) {
    await auth.resetPassword(nickname, token, password);
  },
  async getRegisterSchema() {
    const response = await auth.getRegisterSchema();
    return response;
  },
  async register(store, { email, name, nickname, password }) {
    await auth.register(email, name, nickname, password);
  },
};

import { pick, get } from 'lodash';
import { WENIGPT_OPTIONS } from '../../utils';
import { models } from '@/store/brain/models.js';
import nexusaiAPI from '@/api/nexusaiAPI.js';
import i18n from '../../utils/plugins/i18n';
import { useProjectStore } from '../Project';

export default {
  state: () => ({
    tabsWithError: null,
    isSavingChanges: false,
    tuningsStatus: 'waitingToLoad',

    contentText: {
      uuid: null,
      current: '',
      old: '',
    },

    tunings: {},
    tuningsOld: {},
  }),

  getters: {
    hasBrainTuningsChanged(_state, getters) {
      return getters.brainTuningsFields.some(
        ({ value, previousValue }) => value !== previousValue,
      );
    },

    hasBrainContentTextChanged(state) {
      return state.contentText.current !== state.contentText.old;
    },

    isBrainSaveButtonDisabled(_state, getters) {
      return !getters.hasBrainTuningsChanged;
    },

    brainTuningsFields({ tunings, tuningsOld }) {
      const useValue = (field) => {
        const value = tunings[field.name] || field.default;
        const previousValue = tuningsOld[field.name] || field.default;

        return {
          ...field,
          value,
          previousValue,
        };
      };

      const model = useValue({
        type: 'radio',
        name: 'model',
        options: models.map(({ name }) => name),
        default: models[0].name,
      });

      return [model].concat([
        ...models.find(({ name }) => name === model.value).fields.map(useValue),
      ]);
    },
  },

  actions: {
    async loadBrainTunings({ commit, state, rootState }) {
      if (state.tuningsStatus !== 'waitingToLoad') {
        return;
      }

      try {
        state.tuningsStatus = 'loading';

        const { data } = await nexusaiAPI.router.tunings.read({
          projectUuid: rootState.Auth.connectProjectUuid,
        });

        commit('setBrainTuningsInitialValues', data);
      } finally {
        state.tuningsStatus = 'loaded';
      }
    },

    async saveBrainContentText({ state, commit, rootState }) {
      if (state.contentText.uuid) {
        const { data: contentBaseTextData } =
          await nexusaiAPI.intelligences.contentBases.texts.edit({
            contentBaseUuid: rootState.router.contentBaseUuid,
            contentBaseTextUuid: state.contentText.uuid,
            text: state.contentText.current,
            hideGenericErrorAlert: true,
          });

        commit('setBrainContentTextInitialValues', contentBaseTextData);
      } else {
        const { data: contentBaseTextData } =
          await nexusaiAPI.intelligences.contentBases.texts.create({
            contentBaseUuid: rootState.router.contentBaseUuid,
            text: state.contentText.current,
            hideGenericErrorAlert: true,
          });

        commit('setBrainContentTextInitialValues', contentBaseTextData);
      }
    },

    async saveBrainTunings({ getters, commit, rootState }) {
      const handleFieldName = (name) =>
        name === 'version-gpt' ? 'version' : name;
      const handleFieldValue = (name, value) =>
        name === 'version'
          ? WENIGPT_OPTIONS.find((e) => e.name === value).model
          : value;

      const { data } = await nexusaiAPI.router.tunings.edit({
        projectUuid: rootState.Auth.connectProjectUuid,
        values: getters.brainTuningsFields.reduce(
          (values, field) => ({
            ...values,
            [handleFieldName(field.name)]: handleFieldValue(
              field.name,
              field.value,
            ),
          }),
          {},
        ),
      });

      const fieldsChangeds = getters.brainTuningsFields
        .filter(({ value, previousValue }) => value !== previousValue)
        .map((field) => pick(field, ['name', 'value', 'type']));

      commit('setBrainTuningsInitialValues', data);

      if (window.brainPreviewAddMessage) {
        fieldsChangeds.forEach((field) => {
          const name =
            {
              model: 'router.tunings.model',
            }[field.name] || `router.tunings.fields.${field.name}`;

          window.brainPreviewAddMessage({
            type: 'change',
            name,
            value:
              field.type === 'password'
                ? field.value.replace(/./g, '•')
                : field.value,
          });
        });
      }
    },

    async saveBrainChanges({ state, getters, rootState, dispatch }) {
      try {
        state.isSavingChanges = true;

        const promises = [];

        if (getters.hasBrainTuningsChanged) {
          promises.push(dispatch('saveBrainTunings'));
        }

        const tabsWithError = (await Promise.allSettled(promises))
          .filter(({ status }) => status === 'rejected')
          .map(({ reason }) => get(reason, 'config.routerName'))
          .map(
            (routerName) =>
              ({
                'contentBase-text-create': 'content',
                'contentBase-text-edit': 'content',
                'brain-tunings-edit': 'tunings',
              })[routerName],
          )
          .filter((tab) => tab);

        if (tabsWithError.length) {
          state.tabsWithError = tabsWithError;
        } else {
          rootState.alert = {
            type: 'success',
            text: i18n.global.t('router.tunings.changes_saved'),
          };
        }
      } catch (error) {
        const tabWithError = get(error, 'tab');

        if (tabWithError) {
          state.tabsWithError = [tabWithError];
        }
      } finally {
        state.isSavingChanges = false;
      }
    },

    async upgradeToMultiagents({ state, rootState }) {
      try {
        await nexusaiAPI.router.tunings.multiAgents.edit({
          projectUuid: rootState.Auth.connectProjectUuid,
          multi_agents: true,
          hideGenericErrorAlert: true,
        });

        useProjectStore().updateIsMultiAgents(true);

        rootState.alert = {
          type: 'success',
          text: i18n.global.t('router.tunings.upgrade_to_multi_agents.success'),
        };

        return { status: 'success' };
      } catch (error) {
        rootState.alert = {
          type: 'error',
          text: i18n.global.t('router.tunings.upgrade_to_multi_agents.error'),
        };

        return { status: 'error' };
      }
    },
  },

  mutations: {
    setBrainTuningsInitialValues(state, data) {
      const handleName = (name) =>
        name === 'version' && data.model === 'ChatGPT' ? 'version-gpt' : name;
      const getValue = (name) => {
        const specialValues = ['temperature', 'top_p', 'top_k'];

        if (specialValues.includes(name)) {
          return Number(data.setup[name]);
        }

        if (name === 'version' && data.model === 'WeniGPT') {
          const option = WENIGPT_OPTIONS.find(
            (value) => value.model === data.setup[name],
          );
          return option ? option.name : '';
        }
        return data.setup[name];
      };

      state.tunings['model'] = data.model;
      state.tuningsOld['model'] = data.model;

      Object.keys(data.setup).forEach((name) => {
        state.tunings[handleName(name)] = getValue(name);
        state.tuningsOld[handleName(name)] = getValue(name);
      });
    },

    setBrainContentTextInitialValues(state, data) {
      state.contentText.uuid = data.uuid;
      state.contentText.current = state.contentText.old = data.text;
    },
    updateTuning(state, { name, value }) {
      state.tunings[name] = value;
    },
  },
};

import request from '@/api/nexusaiRequest';
import forceHttps from '@/api/utils/forceHttps';
import { Actions } from './nexus/Actions';
import { Monitoring } from './nexus/Monitoring';
import { AgentsTeam } from './nexus/AgentsTeam';
import { Supervisor } from './nexus/Supervisor';
import { ContentBases } from './nexus/ContentBases';

import { ProgressiveFeedbackAdapter } from './adapters/tunings/progressiveFeedback';
import { ComponentsAdapter } from './adapters/tunings/components';
import i18n from '@/utils/plugins/i18n';

export default {
  question: {
    create({ contentBaseUuid, text, language }) {
      return request.$http.post('api/v1/wenigpt_question/quick-test', {
        content_base_uuid: contentBaseUuid,
        text,
        language,
      });
    },

    feedback: {
      create({ contentBaseUuid, questionUuid, value, feedback }) {
        return request.$http.post(
          `api/${contentBaseUuid}/content-base-logs/${questionUuid}`,
          {
            value,
            feedback,
          },
        );
      },
    },
  },

  listIntelligences({ next, orgUuid } = {}) {
    if (next) {
      return request.$http.get(forceHttps(next));
    }

    return request.$http.get(`api/${orgUuid}/intelligences/`);
  },

  createIntelligence({ orgUuid, name, description }) {
    return request.$http.post(`api/${orgUuid}/intelligences/`, {
      name,
      description,
    });
  },

  readIntelligence({ orgUuid, intelligenceUuid }) {
    return request.$http.get(
      `api/${orgUuid}/intelligences/${intelligenceUuid}/`,
    );
  },

  updateIntelligence({ orgUuid, intelligenceUuid, name, description }) {
    return request.$http.put(
      `api/${orgUuid}/intelligences/${intelligenceUuid}/`,
      {
        name,
        description,
      },
    );
  },

  deleteIntelligence({ orgUuid, intelligenceUuid }) {
    return request.$http.delete(
      `api/${orgUuid}/intelligences/${intelligenceUuid}/`,
    );
  },

  createIntelligenceContentBase({
    intelligenceUuid,
    title,
    language,
    description,
  }) {
    return request.$http.post(`api/${intelligenceUuid}/content-bases/`, {
      title,
      language,
      description,
    });
  },

  patchIntelligenceContentBase({
    intelligenceUuid,
    contentBaseUuid,
    title,
    language,
    description,
  }) {
    return request.$http.patch(
      `api/${intelligenceUuid}/content-bases/${contentBaseUuid}/`,
      {
        title,
        language,
        description,
      },
    );
  },

  listIntelligencesContentBases({ intelligenceUuid, next }) {
    if (next) {
      return request.$http.get(forceHttps(next));
    }

    return request.$http.get(`api/${intelligenceUuid}/content-bases/`);
  },

  readIntelligenceContentBase({
    intelligenceUuid,
    contentBaseUuid,
    obstructiveErrorProducer,
  }) {
    return request.$http.get(
      `api/${intelligenceUuid}/content-bases/${contentBaseUuid}/`,
      { obstructiveErrorProducer },
    );
  },

  deleteIntelligenceContentBase({ intelligenceUuid, contentBaseUuid }) {
    return request.$http.delete(
      `api/${intelligenceUuid}/content-bases/${contentBaseUuid}/`,
    );
  },

  agent_builder: {
    supervisor: Supervisor,
  },

  router: {
    read({ projectUuid, obstructiveErrorProducer }) {
      return request.$http.get(`api/${projectUuid}/router/`, {
        obstructiveErrorProducer,
      });
    },

    monitoring: Monitoring,

    actions: Actions,

    agents_team: AgentsTeam,

    tunings: {
      read({ projectUuid }) {
        return request.$http.get(`api/${projectUuid}/llm/`);
      },

      restoreDefault({ projectUuid }) {
        return request.$http.post(`api/${projectUuid}/llm-default/`);
      },

      edit({ projectUuid, values }) {
        const { model, ...others } = values;

        return request.$http.patch(
          `api/${projectUuid}/llm/`,
          {
            model,
            setup: others,
          },
          {
            routerName: 'brain-tunings-edit',
            hideGenericErrorAlert: true,
          },
        );
      },

      listCredentials({ projectUuid }) {
        return request.$http.get(`api/project/${projectUuid}/credentials`, {
          hideGenericErrorAlert: true,
        });
      },

      editCredentials({ projectUuid, credentials = {}, requestOptions = {} }) {
        return request.$http.patch(
          `api/project/${projectUuid}/credentials`,
          credentials,
          requestOptions,
        );
      },

      createCredentials({ projectUuid, credentials = {}, agent_uuid }) {
        return request.$http.post(`api/project/${projectUuid}/credentials`, {
          credentials,
          agent_uuid,
        });
      },

      async getProgressiveFeedback({ projectUuid }) {
        const response = await request.$http.get(
          `api/project/${projectUuid}/rationale`,
        );

        return ProgressiveFeedbackAdapter.fromApi(response.data);
      },

      editProgressiveFeedback({ projectUuid, data, requestOptions = {} }) {
        return request.$http.patch(
          `api/project/${projectUuid}/rationale`,
          ProgressiveFeedbackAdapter.toApi(data),
          requestOptions,
        );
      },

      async getComponents({ projectUuid }) {
        const response = await request.$http.get(
          `api/project/${projectUuid}/components`,
        );

        return ComponentsAdapter.fromApi(response.data);
      },

      editComponents({ projectUuid, data, requestOptions = {} }) {
        return request.$http.patch(
          `api/project/${projectUuid}/components`,
          ComponentsAdapter.toApi(data),
          requestOptions,
        );
      },

      historyChanges: {
        read({ projectUuid, pageSize = 10, page = 1, filter = '' }) {
          let url = `api/${projectUuid}/activities/?page=${page}&page_size=${pageSize}`;

          if (filter) url = url + `&model_group=${filter}`;

          return request.$http.get(url);
        },
      },

      advanced: {
        read({ projectUuid }) {
          return request.$http.get(`api/${projectUuid}/project`);
        },

        edit({ projectUuid, brain_on }) {
          return request.$http.patch(`api/${projectUuid}/project`, {
            brain_on,
          });
        },
      },

      multiAgents: {
        read({ projectUuid }) {
          return request.$http.get(`api/project/${projectUuid}/multi-agents`);
        },

        edit({ projectUuid, multi_agents }) {
          return request.$http.patch(
            `api/project/${projectUuid}/multi-agents`,
            {
              multi_agents,
            },
          );
        },
      },
    },

    profile: {
      read({ projectUuid }) {
        return request.$http.get(`api/${projectUuid}/customization/`);
      },

      edit({ projectUuid, data }) {
        return request.$http.put(`api/${projectUuid}/customization/`, data, {
          routerName: 'brain-customization-edit',
          hideGenericErrorAlert: true,
        });
      },

      delete({ projectUuid, id }) {
        return request.$http.delete(
          `api/${projectUuid}/customization/?id=${id}`,
        );
      },
    },

    preview: {
      create({ projectUuid, text, attachments, contact_urn }) {
        return request.$http.post(`api/${projectUuid}/preview/`, {
          text,
          attachments,
          contact_urn,
          language: i18n.global.locale,
        });
      },
      uploadFile({ projectUuid, file }) {
        const formData = new FormData();
        formData.append('file', file);

        return request.$http.post(`api/${projectUuid}/upload-file`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      },
    },
  },

  intelligences: {
    contentBases: ContentBases,
  },
};

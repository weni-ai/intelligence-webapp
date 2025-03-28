import { cleanParams } from '@/utils/http';
import request from '@/api/nexusaiRequest';

export const Monitoring = {
  messages: {
    async list({
      projectUuid,
      page,
      pageInterval,
      tag,
      text,
      started_day,
      ended_day,
      source,
    }) {
      const treatedSource = source === 'channels' ? 'router' : source;

      const params = cleanParams({
        tag,
        text,
        started_day,
        ended_day,
        page_size: pageInterval,
        page,
        source: treatedSource,
      });

      const {
        data: { results, count },
      } = await request.$http.get(`api/${projectUuid}/message_history/`, {
        params,
      });

      return {
        count,
        data: results.map(
          ({ id, created_at, message_text, tag, classification }) => ({
            created_at,
            id,
            text: message_text,
            tag,
            action_name: classification,
          }),
        ),
      };
    },

    async getMessageContext({ projectUuid, id }) {
      const { data } = await request.$http.get(
        `api/${projectUuid}/conversation-context/?log_id=${id}`,
        { hideGenericErrorAlert: true },
      );

      return data;
    },

    async detail({ projectUuid, id }) {
      const { data } = await request.$http.get(
        `api/${projectUuid}/message-detail/${id}/`,
        { hideGenericErrorAlert: true },
      );

      return data;
    },

    async rateAnswer({ projectUuid, id, is_approved }) {
      const { data } = await request.$http.patch(
        `api/${projectUuid}/message-detail/${id}/`,
        { is_approved },
      );

      return data;
    },

    async performance({ projectUuid, started_day, ended_day, source }) {
      const treatedSource = source === 'channels' ? 'router' : source;

      const params = cleanParams({
        started_day,
        ended_day,
        source: treatedSource,
      });
      const { data } = await request.$http.get(
        `api/${projectUuid}/tags-analytics/`,
        {
          params,
        },
      );

      return data;
    },

    async getLogs({ projectUuid, messageId }) {
      const { data } = await request.$http.get(
        `api/agents/traces/?project_uuid=${projectUuid}&log_id=${messageId}`,
      );

      return data;
    },
  },
};

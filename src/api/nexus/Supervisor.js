import axios from 'axios';

const request = axios.create({
  baseURL: 'https://nexus.apip.stg.cloud.weni.ai/',
});

export const Supervisor = {
  conversations: {
    async list({ projectUuid, start, end, search }) {
      const params = {
        start,
        end,
        search,
      };

      const { data } = await request.get(
        `/api/${projectUuid}/conversations/?${new URLSearchParams(params)}`,
      );

      return data;
    },

    async forwardStats({ projectUuid, start, end }) {
      const { data } = await request.get(
        `/api/${projectUuid}/conversations/forward-stats/?start=${start}&end=${end}`,
      );

      return data;
    },

    async getById({ projectUuid, conversationId }) {
      const { data } = await request.get(
        `/api/${projectUuid}/conversations/${conversationId}`,
      );

      return data;
    },
  },
};

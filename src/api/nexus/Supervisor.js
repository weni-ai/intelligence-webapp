import billingRequest from '../billingRequest';
import nexusRequest from '../nexusaiRequest';

export const Supervisor = {
  conversations: {
    async list({ projectUuid, page, start, end, search }) {
      const params = {
        page,
        start,
        end,
        search,
      };

      const { data } = await billingRequest.$http.get(
        `${projectUuid}/conversations/?${new URLSearchParams(params)}`,
      );

      return data;
    },

    async forwardStats({ projectUuid, start, end }) {
      const { data } = await billingRequest.$http.get(
        `${projectUuid}/forward-stats/?start=${start}&end=${end}`,
      );

      return data;
    },

    async getById({ projectUuid, conversationId }) {
      const { data } = await nexusRequest.$http.get(
        `/api/${projectUuid}/conversations/${conversationId}`,
      );

      return data;
    },
  },
};

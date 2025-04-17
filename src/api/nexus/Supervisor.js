import billingRequest from '../billingRequest';

export const Supervisor = {
  conversations: {
    async list({ projectUuid }) {
      const { data } = await billingRequest.$http.get(
        `${projectUuid}/conversations/`,
      );

      return data;
    },

    async forwardStats({ projectUuid }) {
      const { data } = await billingRequest.$http.get(
        `${projectUuid}/forward-stats/`,
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

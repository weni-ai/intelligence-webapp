import billingRequest from '../billingRequest';

export const Supervisor = {
  conversations: {
    async forwardStats({ projectUuid }) {
      const { data } = await billingRequest.$http.get(
        `${projectUuid}/forward-stats/`,
      );

      return data;
    },
  },
};

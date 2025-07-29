import nexusRequest from '../nexusaiRequest';

export const Supervisor = {
  conversations: {
    async list({
      projectUuid,
      page,
      start,
      end,
      search,
      status,
      csat,
      topics,
    }) {
      const statusMap = {
        in_progress: 0,
        resolved: 1,
        unresolved: 2,
        unengaged: 3,
      };

      const csatMap = {
        very_satisfied: 0,
        satisfied: 1,
        neutral: 2,
        unsatisfied: 3,
        very_unsatisfied: 4,
      };

      const params = {
        page,
        start_date: start,
        end_date: end,
        ...(search && { search }),
        ...(status.length > 0 && {
          resolution: status.map((status) => statusMap[status]),
        }),
        ...(csat.length > 0 && { csat: csat.map((csat) => csatMap[csat]) }),
        ...(topics.length > 0 && { topics }),
        ...(status.includes('transferred_to_human_support') && {
          has_chats_room: true,
        }),
      };

      const { data } = await nexusRequest.$http.get(
        `/api/${projectUuid}/supervisor/?${new URLSearchParams(params)}`,
      );

      return data;
    },

    async getById({ projectUuid, start, end, urn, next }) {
      const params = {
        start,
        end,
        contact_urn: urn,
      };

      let url = `/api/${projectUuid}/conversations/?${new URLSearchParams(params)}`;

      if (next) {
        url = next.slice(next.indexOf('/api'));
      }

      const { data } = await nexusRequest.$http.get(url);

      return data;
    },

    async export({ projectUuid, token }) {
      const { data } = await nexusRequest.$http.post('/api/reports', {
        auth_token: token,
        project_uuid: projectUuid,
      });
      return data;
    },

    async getExportEmails({ projectUuid }) {
      const { data } = await nexusRequest.$http.get(
        `/api/reports?project_uuid=${projectUuid}`,
      );
      return data;
    },
  },
};

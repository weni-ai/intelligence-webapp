import nexusRequest from '../nexusaiRequest';
import { ConversationAdapter } from '../adapters/supervisor/conversation';

export const Supervisor = {
  conversations: {
    async list(filterData) {
      const { projectUuid, ...filters } = filterData;

      // Transform frontend filters to API format
      // const params = ConversationAdapter.toApi(filters);

      // const { data } = await nexusRequest.$http.get(
      //   `/api/${projectUuid}/supervisor/?${new URLSearchParams(params)}`,
      // );

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      }, 1000);

      const data = {
        count: 5,
        results: [
          {
            created_on: '2025-07-29T17:39:59Z',
            urn: 'telegram:6122765895',
            uuid: null,
            external_id: '33',
            csat: 3,
            topic: null,
            has_chats_room: false,
            start_date: '2025-07-29T17:39:59.000000Z',
            end_date: '2025-07-30T17:39:59.000000Z',
            resolution: 0,
            name: 'Alan Severo',
            is_billing_only: true,
          },
          {
            created_on: '2025-07-29T17:38:20Z',
            urn: 'ext:1591388878567@',
            uuid: null,
            external_id: '32',
            csat: 5,
            topic: null,
            has_chats_room: true,
            start_date: '2025-07-29T17:38:20.000000Z',
            end_date: '2025-07-30T17:38:20.000000Z',
            resolution: 1,
            name: 'Julian Casablancas',
            is_billing_only: true,
          },
          {
            created_on: '2025-07-29T17:35:04Z',
            urn: 'ext:1684982829738@',
            uuid: null,
            external_id: '31',
            csat: null,
            topic: null,
            has_chats_room: false,
            start_date: '2025-07-29T17:35:04.000000Z',
            end_date: '2025-07-30T17:35:04.000000Z',
            resolution: 2,
            name: null,
            is_billing_only: true,
          },
          {
            created_on: '2025-07-26T13:54:05.461631Z',
            urn: 'ext:272851456667@',
            uuid: '677d3d56-eb48-47b0-ba18-ef20db40ae07',
            external_id: '29',
            csat: 2,
            topic: null,
            has_chats_room: true,
            start_date: '2025-07-25T13:50:19Z',
            end_date: '2025-07-26T13:50:19Z',
            resolution: 3,
            name: null,
            is_billing_only: false,
          },
          {
            created_on: '2025-07-26T13:54:05.461631Z',
            urn: 'ext:272851456667@',
            uuid: '677d3d56-eb48-47b0-ba18-ef20db40ae07',
            external_id: '29',
            csat: 1,
            topic: null,
            has_chats_room: false,
            start_date: '2025-07-25T13:50:19Z',
            end_date: '2025-07-26T13:50:19Z',
            resolution: null,
            name: null,
            is_billing_only: false,
          },
        ],
      };

      // Transform API response to frontend format
      return ConversationAdapter.fromApi(data);
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

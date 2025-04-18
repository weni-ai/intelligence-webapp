import { describe, it, expect, vi } from 'vitest';
import nexusaiAPI from '@/api/nexusaiAPI';
import request from '@/api/nexusaiRequest';
import { cleanParams } from '@/utils/http';

vi.mock('@/api/nexusaiRequest', () => ({
  default: {
    $http: {
      get: vi.fn(),
      patch: vi.fn(),
    },
  },
}));

const Monitoring = nexusaiAPI.router.monitoring;

describe('Monitoring API', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('messages.list', () => {
    it('should return formatted message data', async () => {
      const mockResponse = {
        data: {
          results: [
            {
              id: 1,
              created_at: '2024-01-01T00:00:00Z',
              message_text: 'Test1',
              tag: 'success',
            },
            {
              id: 2,
              created_at: '2024-01-02T00:00:00Z',
              message_text: 'Test2',
              tag: 'failed',
            },
          ],
          count: 2,
        },
      };

      request.$http.get.mockResolvedValue(mockResponse);

      const result = await Monitoring.messages.list({
        projectUuid: 'test-uuid',
        page: 1,
        pageInterval: 10,
        tag: 'success',
        text: 'Test1',
        started_day: '2024-01-01',
        ended_day: '2024-01-02',
        source: 'channels',
      });

      expect(request.$http.get).toHaveBeenCalledWith(
        'api/test-uuid/message_history/',
        {
          params: {
            tag: 'success',
            text: 'Test1',
            started_day: '2024-01-01',
            ended_day: '2024-01-02',
            page_size: 10,
            page: 1,
            source: 'router',
          },
        },
      );

      expect(result).toEqual({
        count: 2,
        data: [
          {
            created_at: '2024-01-01T00:00:00Z',
            id: 1,
            text: 'Test1',
            tag: 'success',
          },
          {
            created_at: '2024-01-02T00:00:00Z',
            id: 2,
            text: 'Test2',
            tag: 'failed',
          },
        ],
      });
    });
  });

  describe('messages.getMessageContext', () => {
    it('should return message context data', async () => {
      const mockDetailObj = {
        uuid: '12345',
        text: 'Sample message text',
        status: 's',
        actions_started: true,
        actions_uuid: '12345678',
        actions_type: 'actionType',
        llm_response: 'Sample LLM response',
        is_approved: true,
        contact_urn: 'urn:12345',
        groundedness: [],
      };

      const mockResponse = {
        data: [mockDetailObj, mockDetailObj],
      };

      request.$http.get.mockResolvedValue(mockResponse);

      const result = await Monitoring.messages.getMessageContext({
        projectUuid: 'test-uuid',
        id: '123',
      });

      expect(request.$http.get).toHaveBeenCalledWith(
        'api/test-uuid/conversation-context/?log_id=123',
        {
          hideGenericErrorAlert: true,
        },
      );

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('messages.detail', () => {
    it('should return detail data', async () => {
      const mockResponse = {
        data: {
          uuid: '12345',
          text: 'Sample message text',
          status: 's',
          actions_started: true,
          actions_uuid: '12345678',
          actions_type: 'actionType',
          llm_response: 'Sample LLM response',
          is_approved: true,
          contact_urn: 'urn:12345',
          groundedness: [],
        },
      };

      request.$http.get.mockResolvedValue(mockResponse);

      const result = await Monitoring.messages.detail({
        projectUuid: 'test-uuid',
        id: '123',
      });

      expect(request.$http.get).toHaveBeenCalledWith(
        'api/test-uuid/message-detail/123/',
        {
          hideGenericErrorAlert: true,
        },
      );

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('messages.rateAnswer', () => {
    it('should patch rate answer value', async () => {
      const mockResponse = {
        data: {
          is_approved: true,
        },
      };

      request.$http.patch.mockResolvedValue(mockResponse);

      const result = await Monitoring.messages.rateAnswer({
        projectUuid: 'test-uuid',
        id: '123',
        is_approved: true,
      });

      expect(request.$http.patch).toHaveBeenCalledWith(
        'api/test-uuid/message-detail/123/',
        {
          is_approved: true,
        },
      );

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('messages.performance', () => {
    it('should return performance data', async () => {
      const mockResponse = {
        data: {
          performance: [{ tag: 'success', count: 5 }],
        },
      };

      request.$http.get.mockResolvedValue(mockResponse);

      const result = await Monitoring.messages.performance({
        projectUuid: 'test-uuid',
        started_day: '2024-01-01',
        ended_day: '2024-01-02',
        source: 'channels',
      });

      expect(request.$http.get).toHaveBeenCalledWith(
        'api/test-uuid/tags-analytics/',
        {
          params: {
            started_day: '2024-01-01',
            ended_day: '2024-01-02',
            source: 'router',
          },
        },
      );

      expect(result).toEqual(mockResponse.data);
    });
  });
});

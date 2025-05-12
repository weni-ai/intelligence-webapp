import { describe, it, expect, vi, beforeEach } from 'vitest';
import billingRequest from '@/api/billingRequest';
import nexusRequest from '@/api/nexusaiRequest';
import { Supervisor } from '@/api/nexus/Supervisor';

vi.mock('@/api/billingRequest', () => ({
  default: {
    $http: {
      get: vi.fn(),
    },
  },
}));

vi.mock('@/api/nexusaiRequest', () => ({
  default: {
    $http: {
      get: vi.fn(),
    },
  },
}));

describe('Supervisor.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('conversations.list', () => {
    const mockConversationsResponse = {
      data: {
        count: 2,
        next: null,
        previous: null,
        results: [
          {
            id: 'conv-123',
            created_on: '2023-01-15T12:30:00Z',
            contact: {
              name: 'John Doe',
              urn: 'tel:+123456789',
            },
            messages: [
              {
                id: 'msg-1',
                text: 'Hello',
                created_on: '2023-01-15T12:30:00Z',
                direction: 'in',
              },
              {
                id: 'msg-2',
                text: 'Hi there!',
                created_on: '2023-01-15T12:31:00Z',
                direction: 'out',
              },
            ],
          },
          {
            id: 'conv-456',
            created_on: '2023-01-16T15:00:00Z',
            contact: {
              name: 'Jane Smith',
              urn: 'tel:+987654321',
            },
            messages: [
              {
                id: 'msg-3',
                text: 'I need help',
                created_on: '2023-01-16T15:00:00Z',
                direction: 'in',
              },
              {
                id: 'msg-4',
                text: 'How can I assist you?',
                created_on: '2023-01-16T15:01:00Z',
                direction: 'out',
              },
            ],
          },
        ],
      },
    };

    it('should list conversations with minimal params', async () => {
      billingRequest.$http.get.mockResolvedValue(mockConversationsResponse);

      const projectUuid = 'project-123';
      const page = 1;
      const start = '2023-01-01';
      const end = '2023-01-31';

      const result = await Supervisor.conversations.list({
        projectUuid,
        page,
        start,
        end,
      });

      expect(billingRequest.$http.get).toHaveBeenCalledWith(
        `${projectUuid}/conversations/?page=1&start=2023-01-01&end=2023-01-31`,
      );
      expect(result).toEqual(mockConversationsResponse.data);
      expect(result.count).toBe(2);
      expect(result.results.length).toBe(2);
      expect(result.results[0].id).toBe('conv-123');
      expect(result.results[1].id).toBe('conv-456');
    });

    it('should list conversations with search param', async () => {
      const searchMockResponse = {
        data: {
          count: 1,
          next: null,
          previous: null,
          results: [mockConversationsResponse.data.results[0]],
        },
      };
      billingRequest.$http.get.mockResolvedValue(searchMockResponse);

      const projectUuid = 'project-123';
      const page = 1;
      const start = '2023-01-01';
      const end = '2023-01-31';
      const search = 'John Doe';

      const result = await Supervisor.conversations.list({
        projectUuid,
        page,
        start,
        end,
        search,
      });

      expect(billingRequest.$http.get).toHaveBeenCalledWith(
        `${projectUuid}/conversations/?page=1&start=2023-01-01&end=2023-01-31&search=John+Doe`,
      );
      expect(result).toEqual(searchMockResponse.data);
      expect(result.count).toBe(1);
      expect(result.results.length).toBe(1);
      expect(result.results[0].contact.name).toBe('John Doe');
    });

    it('should list conversations with type param', async () => {
      billingRequest.$http.get.mockResolvedValue(mockConversationsResponse);

      const projectUuid = 'project-123';
      const page = 1;
      const start = '2023-01-01';
      const end = '2023-01-31';
      const type = 'forwarded_human_support';

      const result = await Supervisor.conversations.list({
        projectUuid,
        page,
        start,
        end,
        type,
      });

      expect(billingRequest.$http.get).toHaveBeenCalledWith(
        `${projectUuid}/conversations/?page=1&start=2023-01-01&end=2023-01-31&human_support=true`,
      );
      expect(result).toEqual(mockConversationsResponse.data);
    });

    it('should handle error when listing conversations', async () => {
      const error = new Error('API Error');
      billingRequest.$http.get.mockRejectedValue(error);

      const projectUuid = 'project-123';
      const page = 1;
      const start = '2023-01-01';
      const end = '2023-01-31';

      await expect(
        Supervisor.conversations.list({
          projectUuid,
          page,
          start,
          end,
        }),
      ).rejects.toThrow('API Error');
    });
  });

  describe('conversations.forwardStats', () => {
    const mockStatsResponse = {
      data: {
        total: 100,
        forwarded: 25,
        percentage: 25,
        by_day: [
          {
            date: '2023-01-01',
            total: 10,
            forwarded: 2,
          },
          {
            date: '2023-01-02',
            total: 15,
            forwarded: 5,
          },
        ],
      },
    };

    it('should get forward stats', async () => {
      billingRequest.$http.get.mockResolvedValue(mockStatsResponse);

      const projectUuid = 'project-123';
      const start = '2023-01-01';
      const end = '2023-01-31';

      const result = await Supervisor.conversations.forwardStats({
        projectUuid,
        start,
        end,
      });

      expect(billingRequest.$http.get).toHaveBeenCalledWith(
        `${projectUuid}/forward-stats/?start=2023-01-01&end=2023-01-31`,
      );
      expect(result).toEqual(mockStatsResponse.data);
      expect(result.total).toBe(100);
      expect(result.forwarded).toBe(25);
      expect(result.percentage).toBe(25);
      expect(result.by_day.length).toBe(2);
    });

    it('should handle error when getting forward stats', async () => {
      const error = new Error('API Error');
      billingRequest.$http.get.mockRejectedValue(error);

      const projectUuid = 'project-123';
      const start = '2023-01-01';
      const end = '2023-01-31';

      await expect(
        Supervisor.conversations.forwardStats({
          projectUuid,
          start,
          end,
        }),
      ).rejects.toThrow('API Error');
    });
  });

  describe('conversations.getById', () => {
    const mockConversationResponse = {
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: 'conv-123',
            created_on: '2023-01-15T12:30:00Z',
            contact: {
              name: 'John Doe',
              urn: 'tel:+123456789',
            },
            messages: [
              {
                id: 'msg-1',
                text: 'Hello',
                created_on: '2023-01-15T12:30:00Z',
                direction: 'in',
              },
              {
                id: 'msg-2',
                text: 'Hi there!',
                created_on: '2023-01-15T12:31:00Z',
                direction: 'out',
              },
            ],
            events: [
              {
                id: 'evt-1',
                type: 'forwarded',
                created_on: '2023-01-15T12:32:00Z',
              },
            ],
          },
        ],
      },
    };

    const mockConversationWithNextResponse = {
      data: {
        count: 1,
        next: 'https://api.example.com/api/project-123/conversations/?page=2',
        previous: null,
        results: [
          {
            id: 'conv-123',
            created_on: '2023-01-15T12:30:00Z',
            contact: {
              name: 'John Doe',
              urn: 'tel:+123456789',
            },
            messages: [
              {
                id: 'msg-1',
                text: 'Hello',
                created_on: '2023-01-15T12:30:00Z',
                direction: 'in',
              },
            ],
          },
        ],
      },
    };

    it('should get conversation by id without next param', async () => {
      nexusRequest.$http.get.mockResolvedValue(mockConversationResponse);

      const projectUuid = 'project-123';
      const start = '2023-01-01';
      const urn = 'tel:+123456789';

      const result = await Supervisor.conversations.getById({
        projectUuid,
        start,
        urn,
      });

      expect(nexusRequest.$http.get).toHaveBeenCalledWith(
        `/api/${projectUuid}/conversations/?start=2023-01-01&contact_urn=tel%3A%2B123456789`,
      );
      expect(result).toEqual(mockConversationResponse.data);
      expect(result.results[0].contact.urn).toBe('tel:+123456789');
      expect(result.results[0].messages.length).toBe(2);
    });

    it('should get conversation by id with next param', async () => {
      nexusRequest.$http.get.mockResolvedValue(
        mockConversationWithNextResponse,
      );

      const projectUuid = 'project-123';
      const start = '2023-01-01';
      const urn = 'tel:+123456789';
      const next =
        'https://api.example.com/api/project-123/conversations/?page=1';

      const result = await Supervisor.conversations.getById({
        projectUuid,
        start,
        urn,
        next,
      });

      expect(nexusRequest.$http.get).toHaveBeenCalledWith(
        '/api.example.com/api/project-123/conversations/?page=1',
      );
      expect(result).toEqual(mockConversationWithNextResponse.data);
      expect(result.next).toBeTruthy();
    });

    it('should handle error when getting conversation by id', async () => {
      const error = new Error('API Error');
      nexusRequest.$http.get.mockRejectedValue(error);

      const projectUuid = 'project-123';
      const start = '2023-01-01';
      const urn = 'tel:+123456789';

      await expect(
        Supervisor.conversations.getById({
          projectUuid,
          start,
          urn,
        }),
      ).rejects.toThrow('API Error');
    });
  });
});

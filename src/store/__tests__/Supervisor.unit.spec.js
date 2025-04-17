import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSupervisorStore } from '../Supervisor';
import nexusaiAPI from '@/api/nexusaiAPI';
import { PerformanceAdapter } from '@/api/adapters/supervisor/performance';

vi.mock('@/api/nexusaiAPI', () => ({
  default: {
    agent_builder: {
      supervisor: {
        conversations: {
          forwardStats: vi.fn(),
          list: vi.fn(),
        },
      },
    },
  },
}));

vi.mock('../', () => ({
  default: {
    state: {
      Auth: {
        connectProjectUuid: 'test-project-uuid',
      },
    },
  },
}));

describe('Supervisor Store', () => {
  let store;

  beforeEach(() => {
    setActivePinia(createPinia());

    vi.clearAllMocks();

    store = useSupervisorStore();
  });

  describe('Initial state', () => {
    it('has the correct initial state for forwardStats', () => {
      expect(store.forwardStats).toEqual({
        status: null,
        data: {
          attendedByAgent: 0,
          forwardedHumanSupport: 0,
        },
      });
    });

    it('has the correct initial state for conversations', () => {
      expect(store.conversations).toEqual({
        status: null,
        data: [],
      });
    });
  });

  describe('Adapters', () => {
    describe('PerformanceAdapter', () => {
      it('transforms API data to the correct format', () => {
        const apiData = {
          attended_by_agent: 15,
          forwarded_human_support: 8,
        };

        const result = PerformanceAdapter.fromApi(apiData);

        expect(result).toEqual({
          attendedByAgent: 15,
          forwardedHumanSupport: 8,
        });
      });
    });
  });

  describe('Actions', () => {
    describe('loadForwardStats', () => {
      it('sets status to loading when started', async () => {
        nexusaiAPI.agent_builder.supervisor.conversations.forwardStats.mockReturnValue(
          new Promise(() => {}),
        );

        store.loadForwardStats();

        expect(store.forwardStats.status).toBe('loading');

        await Promise.resolve();
      });

      it('fetches forward stats successfully', async () => {
        const mockApiResponse = {
          attended_by_agent: 10,
          forwarded_human_support: 5,
        };

        const expectedData = {
          attendedByAgent: 67, // 10 / 15 * 100 (15 is the total of metrics)
          forwardedHumanSupport: 33, // 5 / 15 * 100 (15 is the total of metrics)
        };

        nexusaiAPI.agent_builder.supervisor.conversations.forwardStats.mockResolvedValue(
          mockApiResponse,
        );

        await store.loadForwardStats();

        expect(
          nexusaiAPI.agent_builder.supervisor.conversations.forwardStats,
        ).toHaveBeenCalledWith({
          projectUuid: 'test-project-uuid',
        });

        expect(store.forwardStats.status).toBe('complete');
        expect(store.forwardStats.data).toEqual(expectedData);
      });

      it('handles errors when fetching forward stats', async () => {
        nexusaiAPI.agent_builder.supervisor.conversations.forwardStats.mockRejectedValue(
          new Error('API Error'),
        );

        await store.loadForwardStats();

        expect(store.forwardStats.status).toBe('error');
        expect(store.forwardStats.data).toEqual({
          attendedByAgent: 0,
          forwardedHumanSupport: 0,
        });
      });
    });

    describe('loadConversations', () => {
      it('sets status to loading when started', async () => {
        nexusaiAPI.agent_builder.supervisor.conversations.list.mockReturnValue(
          new Promise(() => {}),
        );

        store.loadConversations();

        expect(store.conversations.status).toBe('loading');

        await Promise.resolve();
      });

      it('fetches conversations successfully', async () => {
        const mockApiResponse = [
          { id: 1, title: 'Conversation 1' },
          { id: 2, title: 'Conversation 2' },
        ];

        nexusaiAPI.agent_builder.supervisor.conversations.list.mockResolvedValue(
          mockApiResponse,
        );

        await store.loadConversations();

        expect(
          nexusaiAPI.agent_builder.supervisor.conversations.list,
        ).toHaveBeenCalledWith({
          projectUuid: 'test-project-uuid',
          start: '2025-01-01',
          end: '2025-05-01',
        });

        expect(store.conversations.status).toBe('complete');
        expect(store.conversations.data).toEqual(mockApiResponse);
      });

      it('handles errors when fetching conversations', async () => {
        nexusaiAPI.agent_builder.supervisor.conversations.list.mockRejectedValue(
          new Error('API Error'),
        );

        await store.loadConversations();

        expect(store.conversations.status).toBe('error');
        expect(store.conversations.data).toEqual([]);
      });
    });
  });
});

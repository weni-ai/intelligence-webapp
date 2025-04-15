import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSupervisorStore } from '../Supervisor';
import nexusaiAPI from '@/api/nexusaiAPI';

vi.mock('@/api/nexusaiAPI', () => ({
  default: {
    agent_builder: {
      supervisor: {
        conversations: {
          forwardStats: vi.fn(),
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
    it('has the correct initial state', () => {
      expect(store.forwardStats).toEqual({
        status: null,
        data: {
          attendedByAgent: 0,
          forwardedHumanSupport: 0,
        },
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
          attendedByAgent: 10,
          forwardedHumanSupport: 5,
        };

        nexusaiAPI.agent_builder.supervisor.conversations.forwardStats.mockResolvedValue(
          mockApiResponse,
        );

        await store.loadForwardStats();

        expect(
          nexusaiAPI.agent_builder.supervisor.conversations.forwardStats,
        ).toHaveBeenCalledWith({
          projectUuid: 'test-project-uuid',
          start: '2025-01-01',
          end: '2025-05-01',
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
  });
});

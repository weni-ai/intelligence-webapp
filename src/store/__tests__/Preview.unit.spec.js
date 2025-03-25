import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { usePreviewStore } from '@/store/Preview';
import { useAgentsTeamStore } from '@/store/AgentsTeam';
import WS from '@/websocket/setup';

vi.mock('@/websocket/setup');
vi.mock('@/store/AgentsTeam', () => ({
  useAgentsTeamStore: vi.fn(),
}));
vi.mock('@/store', () => ({
  default: {
    state: {
      Auth: {
        connectProjectUuid: 'test-project-uuid',
        token: 'Bearer test-token',
      },
    },
  },
}));

describe('PreviewStore', () => {
  let store;
  let mockAgentsTeamStore;
  let mockWsInstance;

  beforeEach(() => {
    setActivePinia(createPinia());

    mockAgentsTeamStore = {
      activeTeam: {
        data: {
          agents: [
            { external_id: 'agent-1', name: 'Agent 1' },
            { external_id: 'agent-2', name: 'Agent 2' },
          ],
          manager: { external_id: 'manager', name: 'Manager' },
        },
      },
    };

    mockWsInstance = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    };

    WS.mockImplementation(() => mockWsInstance);
    useAgentsTeamStore.mockReturnValue(mockAgentsTeamStore);

    store = usePreviewStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial state', () => {
    it('should have initial state properties', () => {
      expect(store.ws).toBeNull();
      expect(store.traces).toEqual([]);
      expect(store.collaboratorsTraces).toEqual([]);
    });
  });

  describe('Computed properties', () => {
    it('should filter and map collaborators traces correctly', () => {
      store.traces = [
        { type: 'trace_update', trace: { id: 1 } },
        { type: 'other_type', trace: { id: 2 } },
        { type: 'trace_update', trace: { id: 3 } },
      ];

      expect(store.collaboratorsTraces).toEqual([{ id: 1 }, { id: 3 }]);
    });

    it('should return the active agent based on the last trace', () => {
      store.traces = [
        { trace: { trace: { agentId: 'agent-1' }, summary: 'Task 1' } },
        { trace: { trace: { agentId: 'agent-2' }, summary: 'Task 2' } },
      ];

      expect(store.activeAgent).toEqual({
        ...mockAgentsTeamStore.activeTeam.data.agents[1],
        currentTask: 'Task 2',
      });
    });

    it('should return the manager when agent not found', () => {
      store.traces = [
        { trace: { trace: { agentId: 'unknown-agent' }, summary: 'Task X' } },
      ];

      expect(store.activeAgent).toEqual({
        ...mockAgentsTeamStore.activeTeam.data.manager,
        currentTask: 'Task X',
      });
    });
  });

  describe('Actions', () => {
    it('should add a trace', () => {
      const trace = { type: 'trace_update', trace: { id: 1 } };
      store.addTrace(trace);

      expect(store.traces).toEqual([trace]);
    });

    it('should clear traces', () => {
      store.traces = [
        { type: 'trace_update', trace: { id: 1 } },
        { type: 'trace_update', trace: { id: 2 } },
      ];

      store.clearTraces();

      expect(store.traces).toEqual([]);
    });

    it('should connect to WebSocket', () => {
      store.connectWS();

      expect(WS).toHaveBeenCalledWith({
        project: 'test-project-uuid',
        token: 'test-token',
        endpoint: 'preview',
      });

      expect(mockWsInstance.connect).toHaveBeenCalled();

      expect(store.ws).toStrictEqual(mockWsInstance);
    });

    it('should not create a new WebSocket if one already exists', () => {
      store.ws = mockWsInstance;

      store.connectWS();

      expect(WS).toHaveBeenCalledTimes(0);
    });

    it('should disconnect from WebSocket', () => {
      store.ws = mockWsInstance;

      store.disconnectWS();

      expect(mockWsInstance.disconnect).toHaveBeenCalled();

      expect(store.ws).toBeNull();
    });

    it('should not try to disconnect if no WebSocket exists', () => {
      store.ws = null;

      store.disconnectWS();

      expect(mockWsInstance.disconnect).not.toHaveBeenCalled();
    });
  });
});

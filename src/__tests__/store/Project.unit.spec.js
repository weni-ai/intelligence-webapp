import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useProjectStore } from '@/store/Project';
import globalStore from '@/store';

vi.mock('@/store', () => ({
  default: {
    state: {
      Auth: {
        connectProjectUuid: null,
      },
    },
  },
}));

describe('Project Store', () => {
  let projectStore;
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    globalStore.state.Auth.connectProjectUuid = null;

    projectStore = useProjectStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have null isMultiAgents initially', () => {
      expect(projectStore.isMultiAgents).toBeNull();
    });

    it('should have uuid computed from globalStore.state.Auth.connectProjectUuid', () => {
      expect(projectStore.uuid).toBeNull();
    });
  });

  describe('uuid computed property', () => {
    it('should return connectProjectUuid from global Auth state', () => {
      const testUuid = 'test-project-uuid-123';
      globalStore.state.Auth.connectProjectUuid = testUuid;

      expect(projectStore.uuid).toBe(testUuid);
    });

    it('should return null when connectProjectUuid is null', () => {
      globalStore.state.Auth.connectProjectUuid = null;

      expect(projectStore.uuid).toBeNull();
    });

    it('should return empty string when connectProjectUuid is empty string', () => {
      globalStore.state.Auth.connectProjectUuid = '';

      expect(projectStore.uuid).toBe('');
    });
  });
});

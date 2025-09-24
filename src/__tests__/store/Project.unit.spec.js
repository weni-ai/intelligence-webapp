import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useProjectStore } from '@/store/Project';

const mockSessionStorage = {
  getItem: vi.fn(() => 'test-project-uuid'),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

describe('Project Store', () => {
  let projectStore;
  let pinia;

  beforeEach(() => {
    pinia = createPinia();
    setActivePinia(pinia);

    projectStore = useProjectStore();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have null isMultiAgents initially', () => {
      expect(projectStore.isMultiAgents).toBeNull();
    });
  });

  describe('uuid computed property', () => {
    it('should return uuid from sessionStorage when available', () => {
      expect(projectStore.uuid).toBe('test-project-uuid');
    });
  });

  describe('updateIsMultiAgents action', () => {
    it('should update isMultiAgents to true', async () => {
      await projectStore.updateIsMultiAgents(true);

      expect(projectStore.isMultiAgents).toBe(true);
    });

    it('should update isMultiAgents to false', async () => {
      await projectStore.updateIsMultiAgents(false);

      expect(projectStore.isMultiAgents).toBe(false);
    });

    it('should update isMultiAgents to null', async () => {
      await projectStore.updateIsMultiAgents(true);
      expect(projectStore.isMultiAgents).toBe(true);

      await projectStore.updateIsMultiAgents(null);
      expect(projectStore.isMultiAgents).toBeNull();
    });

    it('should handle non-boolean values', async () => {
      await projectStore.updateIsMultiAgents('true');
      expect(projectStore.isMultiAgents).toBe('true');

      await projectStore.updateIsMultiAgents(1);
      expect(projectStore.isMultiAgents).toBe(1);

      await projectStore.updateIsMultiAgents(0);
      expect(projectStore.isMultiAgents).toBe(0);
    });
  });
});

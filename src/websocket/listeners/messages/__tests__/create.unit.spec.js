import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import { useMonitoringStore } from '@/store/Monitoring';
import createMessageListener from '../create';

vi.mock('@/store/Monitoring', () => ({
  useMonitoringStore: vi.fn(),
}));

describe('createMessageListener', () => {
  let monitoringStore;

  beforeEach(() => {
    monitoringStore = {
      createNewMessage: vi.fn(),
    };

    useMonitoringStore.mockReturnValue(monitoringStore);
    vi.clearAllMocks();
  });

  describe('Message creation', () => {
    it('should call monitoringStore.createNewMessage with the correct message', () => {
      const message = { id: 1, content: 'Test message', timestamp: Date.now() };

      createMessageListener(message);

      expect(useMonitoringStore).toHaveBeenCalled();
      expect(monitoringStore.createNewMessage).toHaveBeenCalledWith({
        message,
      });
    });

    it('should handle empty message object', () => {
      const message = {};

      createMessageListener(message);

      expect(monitoringStore.createNewMessage).toHaveBeenCalledWith({
        message,
      });
    });

    it('should handle null message', () => {
      const message = null;

      createMessageListener(message);

      expect(monitoringStore.createNewMessage).toHaveBeenCalledWith({
        message,
      });
    });

    it('should handle undefined message', () => {
      const message = undefined;

      createMessageListener(message);

      expect(monitoringStore.createNewMessage).toHaveBeenCalledWith({
        message,
      });
    });
  });
});

import { describe, it, expect } from 'vitest';
import { PerformanceAdapter } from '../performance';

describe('PerformanceAdapter', () => {
  describe('fromApi', () => {
    it('transforms API data to client format', () => {
      const apiData = {
        attended_by_agent: true,
        forwarded_human_support: false,
      };

      const expectedResult = {
        attendedByAgent: true,
        forwardedHumanSupport: false,
      };

      const result = PerformanceAdapter.fromApi(apiData);

      expect(result).toEqual(expectedResult);
    });

    it('handles undefined values', () => {
      const apiData = {
        attended_by_agent: undefined,
        forwarded_human_support: undefined,
      };

      const expectedResult = {
        attendedByAgent: undefined,
        forwardedHumanSupport: undefined,
      };

      const result = PerformanceAdapter.fromApi(apiData);

      expect(result).toEqual(expectedResult);
    });
  });
});

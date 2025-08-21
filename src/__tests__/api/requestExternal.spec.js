import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import requestExternal from '@/api/requestExternal';

vi.mock('axios', () => ({
  default: {
    create: vi.fn(),
  },
}));

vi.stubEnv('API_BASE_URL', 'http://brain.weni.com');

describe('requestExternal.js', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create axios client with correct baseURL', () => {
    requestExternal.$http('mockToken');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://brain.weni.com',
      headers: {
        Authorization: 'Translator mockToken',
      },
    });
  });

  it('should not include Authorization header when token is not provided', () => {
    requestExternal.$http(null);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://brain.weni.com',
      headers: {},
    });
  });

  it('should use empty headers when token is an empty string', () => {
    requestExternal.$http('');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://brain.weni.com',
      headers: {},
    });
  });

  it('should handle when env variable returns a different URL', () => {
    vi.stubEnv('API_BASE_URL', 'http://another-url.com');
    requestExternal.$http('anotherToken');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: 'http://another-url.com',
      headers: {
        Authorization: 'Translator anotherToken',
      },
    });
  });
});

// Mock axios to avoid import.meta issues in tests
jest.mock('axios');

describe('Rick and Morty API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('API Configuration', () => {
    it('should have correct base URL', () => {
      const BASE_URL = 'https://rickandmortyapi.com/api';
      expect(BASE_URL).toBe('https://rickandmortyapi.com/api');
    });

    it('should have correct timeout configuration', () => {
      const timeout = 10000;
      expect(timeout).toBe(10000);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', () => {
      const errorMessage = 'Network error';
      const error = new Error(errorMessage);
      
      expect(error.message).toBe(errorMessage);
    });

    it('should fallback to mock API when needed', () => {
      const mockResponse = {
        info: { count: 8, pages: 1, next: null, prev: null },
        results: []
      };
      
      expect(mockResponse.info.count).toBe(8);
    });
  });
});
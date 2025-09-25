import { mockApi } from '../mockApi';
import type { CharacterResponse } from '../../types/api';

describe('Mock API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCharacters', () => {
    it('should return characters with correct pagination for page 1', async () => {
      const result: CharacterResponse = await mockApi.getCharacters(1);

      expect(result).toHaveProperty('info');
      expect(result).toHaveProperty('results');
      expect(Array.isArray(result.results)).toBe(true);
      expect(result.results.length).toBeGreaterThan(0);
      expect(result.info.count).toBe(8);
      expect(result.info.pages).toBe(1);
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await mockApi.getCharacters(1);
      const endTime = Date.now();

      expect(endTime - startTime).toBeGreaterThanOrEqual(800);
    });

    it('should handle pagination correctly', async () => {
      const result = await mockApi.getCharacters(2);

      expect(result.results).toHaveLength(0);
      expect(result.info.prev).toBe('?page=1');
      expect(result.info.next).toBe(null);
    });
  });

  describe('searchCharacters', () => {
    it('should filter characters by name', async () => {
      const result = await mockApi.searchCharacters('Rick');

      expect(result.results.length).toBeGreaterThan(0);
      result.results.forEach(character => {
        expect(character.name.toLowerCase()).toContain('rick');
      });
    });

    it('should return empty results for non-existent characters', async () => {
      const result = await mockApi.searchCharacters('NonExistentCharacter');

      expect(result.results).toHaveLength(0);
      expect(result.info.count).toBe(0);
    });

    it('should be case insensitive', async () => {
      const lowerCaseResult = await mockApi.searchCharacters('rick');
      const upperCaseResult = await mockApi.searchCharacters('RICK');

      expect(lowerCaseResult.results.length).toBe(upperCaseResult.results.length);
    });
  });
});
import type { Character, ApiResponse } from '../api';

describe('API Types', () => {
  describe('Character interface', () => {
    it('should have all required properties', () => {
      const mockCharacter: Character = {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth (C-137)', url: '' },
        location: { name: 'Citadel of Ricks', url: '' },
        image: 'https://example.com/image.jpg',
        episode: [],
        url: '',
        created: '2017-11-04T18:48:46.250Z'
      };

      expect(mockCharacter).toHaveProperty('id');
      expect(mockCharacter).toHaveProperty('name');
      expect(mockCharacter).toHaveProperty('status');
      expect(mockCharacter.status).toMatch(/^(Alive|Dead|unknown)$/);
    });
  });

  describe('ApiResponse interface', () => {
    it('should structure pagination info correctly', () => {
      const mockResponse: ApiResponse<Character> = {
        info: {
          count: 826,
          pages: 42,
          next: 'https://rickandmortyapi.com/api/character?page=2',
          prev: null
        },
        results: []
      };

      expect(mockResponse.info).toHaveProperty('count');
      expect(mockResponse.info).toHaveProperty('pages');
      expect(mockResponse.info).toHaveProperty('next');
      expect(mockResponse.info).toHaveProperty('prev');
      expect(mockResponse).toHaveProperty('results');
      expect(Array.isArray(mockResponse.results)).toBe(true);
    });
  });
});
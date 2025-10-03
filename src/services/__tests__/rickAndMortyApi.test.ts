import axios from 'axios';
import { rickAndMortyApi } from '../rickAndMortyApi';
import type { Character } from '../../types/api';

// This is the variable that will hold our mock `get` function.
// It's defined here so it can be accessed from both the mock factory and the tests.
let mockGet: jest.Mock;

jest.mock('axios', () => {
  // Initialize the mock function inside the factory.
  // This runs before any other module code.
  mockGet = jest.fn();
  return {
    __esModule: true,
    default: {
      create: () => ({
        get: mockGet, // Use the initialized mock function
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      }),
    },
  };
});

describe('Rick and Morty API Service', () => {
  beforeEach(() => {
    // Clear mock history before each test
    mockGet.mockClear();
  });

  describe('getCharacter', () => {
    it('should fetch a single character successfully', async () => {
      // Arrange
      const characterId = 1;
      const mockCharacter: Character = {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        type: '',
        gender: 'Male',
        origin: { name: 'Earth (C-137)', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Citadel of Ricks', url: 'https://rickandmortyapi.com/api/location/3' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/1',
        created: '2017-11-04T18:48:46.250Z',
      };
      
      // Setup the mock for this specific test
      mockGet.mockResolvedValue({ data: mockCharacter });

      // Act
      const result = await rickAndMortyApi.getCharacter(characterId);

      // Assert
      expect(mockGet).toHaveBeenCalledTimes(1);
      expect(mockGet).toHaveBeenCalledWith(`/character/${characterId}`);
      expect(result).toEqual(mockCharacter);
    });
  });
});

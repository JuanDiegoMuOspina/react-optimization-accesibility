import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { CharacterResponse, Character } from '../types/api';
import { mockApi } from './mockApi';

const BASE_URL = 'https://rickandmortyapi.com/api';

// Configure axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use((config) => {
  console.log(`Making API request to: ${config.baseURL}${config.url}`);
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('API request failed:', error.message);
    return Promise.reject(error);
  }
);

const shouldUseMockApi = () => {
  // Use mock API when explicitly set in environment or when real API is not available
  // In development mode, try real API first but fall back to mock if it fails
  return process.env.VITE_USE_MOCK_API === 'true' || typeof window === 'undefined';
};

export const rickAndMortyApi = {
  getCharacters: async (page: number = 1): Promise<CharacterResponse> => {
    try {
      if (shouldUseMockApi()) {
        return await mockApi.getCharacters(page);
      }
      
      const response = await api.get<CharacterResponse>('/character', {
        params: { page }
      });
      
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to mock data:', error);
      return await mockApi.getCharacters(page);
    }
  },

  getCharacter: async (id: number): Promise<Character> => {
    try {
      if (shouldUseMockApi()) {
        const result = await mockApi.getCharacters(1);
        const character = result.results.find(c => c.id === id);
        if (!character) {
          throw new Error(`Character ${id} not found`);
        }
        return character;
      }
      
      const response = await api.get<Character>(`/character/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to mock data:', error);
      const result = await mockApi.getCharacters(1);
      const character = result.results.find(c => c.id === id);
      if (!character) {
        throw new Error(`Character ${id} not found`);
      }
      return character;
    }
  },

  searchCharacters: async (name: string, page: number = 1): Promise<CharacterResponse> => {
    try {
      if (shouldUseMockApi()) {
        return await mockApi.searchCharacters(name, page);
      }
      
      const response = await api.get<CharacterResponse>('/character', {
        params: { name, page }
      });
      
      return response.data;
    } catch (error) {
      console.warn('Real API failed, falling back to mock data:', error);
      return await mockApi.searchCharacters(name, page);
    }
  }
};
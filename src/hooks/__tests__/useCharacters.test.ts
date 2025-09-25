import { renderHook, act, waitFor } from '@testing-library/react';
import { useCharacters } from '../useCharacters';

// Mock the API module
jest.mock('../../services/rickAndMortyApi', () => ({
  rickAndMortyApi: {
    getCharacters: jest.fn(),
    searchCharacters: jest.fn(),
  }
}));

import { rickAndMortyApi } from '../../services/rickAndMortyApi';
const mockedApi = rickAndMortyApi as jest.Mocked<typeof rickAndMortyApi>;

describe('useCharacters hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch characters on mount', async () => {
    const mockResponse = {
      info: { count: 826, pages: 42, next: 'page2', prev: null },
      results: [
        { id: 1, name: 'Rick Sanchez', status: 'Alive' as const }
      ]
    };

    mockedApi.getCharacters.mockResolvedValue(mockResponse as any);

    const { result } = renderHook(() => useCharacters());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.characters).toEqual(mockResponse.results);
    expect(result.current.pagination.currentPage).toBe(1);
    expect(result.current.pagination.totalPages).toBe(42);
    expect(result.current.pagination.hasNext).toBe(true);
    expect(result.current.pagination.hasPrev).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle search functionality', async () => {
    const mockSearchResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [
        { id: 1, name: 'Rick Sanchez', status: 'Alive' as const }
      ]
    };

    mockedApi.getCharacters.mockResolvedValue({
      info: { count: 826, pages: 42, next: null, prev: null },
      results: []
    } as any);

    mockedApi.searchCharacters.mockResolvedValue(mockSearchResponse as any);

    const { result } = renderHook(() => useCharacters());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handleSearch('Rick');
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedApi.searchCharacters).toHaveBeenCalledWith('Rick', 1);
    expect(result.current.characters).toEqual(mockSearchResponse.results);
  });

  it('should handle page changes', async () => {
    const initialResponse = {
      info: { count: 826, pages: 42, next: 'page2', prev: null },
      results: [{ id: 1, name: 'Rick Sanchez' }]
    };

    const page2Response = {
      info: { count: 826, pages: 42, next: 'page3', prev: 'page1' },
      results: [{ id: 21, name: 'Aqua Morty' }]
    };

    mockedApi.getCharacters
      .mockResolvedValueOnce(initialResponse as any)
      .mockResolvedValueOnce(page2Response as any);

    const { result } = renderHook(() => useCharacters());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.handlePageChange(2);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockedApi.getCharacters).toHaveBeenCalledWith(2);
    expect(result.current.pagination.currentPage).toBe(2);
    expect(result.current.pagination.hasNext).toBe(true);
    expect(result.current.pagination.hasPrev).toBe(true);
  });

  it('should handle API errors', async () => {
    const errorMessage = 'Network error';
    mockedApi.getCharacters.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useCharacters());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.characters).toEqual([]);
  });
});
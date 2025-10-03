import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock the API module
jest.mock('../services/rickAndMortyApi', () => ({
  rickAndMortyApi: {
    getCharacters: jest.fn(),
    searchCharacters: jest.fn(),
  }
}));

// Mock images
jest.mock('../assets/o6cwlzg3exk41.png', () => 'header-image.png');
jest.mock('../assets/rick-and-morty-escape-facebook-cover.jpg', () => 'footer-image.jpg');

import { rickAndMortyApi } from '../services/rickAndMortyApi';
const mockedApi = rickAndMortyApi as jest.Mocked<typeof rickAndMortyApi>;

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the application with initial data', async () => {
    const mockResponse = {
      info: { count: 826, pages: 42, next: 'page2', prev: null },
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive' as const,
          species: 'Human',
          type: '',
          gender: 'Male' as const,
          origin: { name: 'Earth (C-137)', url: '' },
          location: { name: 'Citadel of Ricks', url: '' },
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: [],
          url: '',
          created: '2017-11-04T18:48:46.250Z'
        }
      ]
    };

    mockedApi.getCharacters.mockResolvedValue(mockResponse);

    render(<App />);

    // Check if header is rendered
    expect(screen.getByText('Rick and Morty Characters')).toBeInTheDocument();
    expect(screen.getByText('Explore characters from the multiverse')).toBeInTheDocument();

    // Check if search bar is rendered
    expect(screen.getByPlaceholderText('Search for characters...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    // Check if character card is rendered
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();

    // Check if footer is rendered
    expect(screen.getByText('Adventure Awaits!')).toBeInTheDocument();
  });

  it('should perform search and display results', async () => {
    const user = userEvent.setup();

    // Initial load
    const initialResponse = {
      info: { count: 826, pages: 42, next: null, prev: null },
      results: []
    };

    // Search response
    const searchResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          status: 'Alive' as const,
          species: 'Human',
          type: '',
          gender: 'Male' as const,
          origin: { name: 'Earth (C-137)', url: '' },
          location: { name: 'Citadel of Ricks', url: '' },
          image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
          episode: [],
          url: '',
          created: '2017-11-04T18:48:46.250Z'
        }
      ]
    };

    mockedApi.getCharacters.mockResolvedValue(initialResponse);
    mockedApi.searchCharacters.mockResolvedValue(searchResponse);

    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
    });

    // Perform search
    const searchInput = screen.getByPlaceholderText('Search for characters...');
    const searchButton = screen.getByText('Search');

    await user.type(searchInput, 'Rick');
    await user.click(searchButton);

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });

    expect(mockedApi.searchCharacters).toHaveBeenCalledWith('Rick', 1);
  });

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Network error occurred';
    mockedApi.getCharacters.mockRejectedValue(new Error(errorMessage));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should display loading spinner during data fetch', async () => {
    const emptyResponse = {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: []
    };

    mockedApi.getCharacters.mockResolvedValue(emptyResponse);

    render(<App />);

    // Loading spinner should be visible initially
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();

    await waitFor(() => {
      expect(document.querySelector('.animate-spin')).not.toBeInTheDocument();
    });
  });

  it('should show no characters message when results are empty', async () => {
    const emptyResponse = {
      info: { count: 0, pages: 0, next: null, prev: null },
      results: []
    };

    mockedApi.getCharacters.mockResolvedValue(emptyResponse);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No characters found')).toBeInTheDocument();
    });
  it('should allow searching and then paginating through results', async () => {
    const user = userEvent.setup();

    // Mock responses
    const initialResponse = { info: { count: 0, pages: 0, next: null, prev: null }, results: [] };
    const searchResponsePage1 = {
      info: { count: 2, pages: 2, next: 'page2', prev: null },
      results: [{ id: 1, name: 'Rick Sanchez', status: 'Alive' as const, species: 'Human', gender: 'Male' as const, origin: { name: 'Earth (C-137)', url: '' }, location: { name: 'Citadel of Ricks', url: '' }, image: '', episode: [], url: '', created: '' }],
    };
    const searchResponsePage2 = {
      info: { count: 2, pages: 2, next: null, prev: 'page1' },
      results: [{ id: 8, name: 'Adjudicator Rick', status: 'Dead' as const, species: 'Human', gender: 'Male' as const, origin: { name: 'unknown', url: '' }, location: { name: 'Citadel of Ricks', url: '' }, image: '', episode: [], url: '', created: '' }],
    };

    // Setup mock call sequence
    mockedApi.getCharacters.mockResolvedValue(initialResponse);
    mockedApi.searchCharacters
      .mockResolvedValueOnce(searchResponsePage1) // First call for search
      .mockResolvedValueOnce(searchResponsePage2); // Second call for pagination

    render(<App />);

    // 1. Perform search
    const searchInput = screen.getByPlaceholderText('Search for characters...');
    const searchButton = screen.getByText('Search');
    await user.type(searchInput, 'Rick');
    await user.click(searchButton);

    // 2. Verify first page of search results
    await waitFor(() => {
      expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    });
    expect(mockedApi.searchCharacters).toHaveBeenCalledWith('Rick', 1);

    // 3. Paginate to the next page
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);

    // 4. Verify second page of search results
    await waitFor(() => {
      expect(screen.getByText('Adjudicator Rick')).toBeInTheDocument();
    });
    expect(screen.queryByText('Rick Sanchez')).not.toBeInTheDocument();
    expect(mockedApi.searchCharacters).toHaveBeenCalledWith('Rick', 2);
    expect(mockedApi.searchCharacters).toHaveBeenCalledTimes(2);
  });
});
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} />);

    expect(screen.getByPlaceholderText('Search for characters...')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('should call onSearch when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for characters...');
    const searchButton = screen.getByText('Search');

    await user.type(input, 'Rick');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });

  it('should call onSearch when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for characters...');

    await user.type(input, 'Morty');
    await user.keyboard('{Enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('Morty');
  });

  it('should show clear button when there is text', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for characters...');

    await user.type(input, 'Rick');

    expect(screen.getByText('✕')).toBeInTheDocument();
  });

  it('should clear input and call onSearch with empty string when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for characters...');

    await user.type(input, 'Rick');
    const clearButton = screen.getByText('✕');
    await user.click(clearButton);

    expect(input).toHaveValue('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  it('should disable input when loading', () => {
    render(<SearchBar onSearch={mockOnSearch} isLoading={true} />);

    const input = screen.getByPlaceholderText('Search for characters...');
    expect(input).toBeDisabled();
  });

  it('should trim whitespace from search query', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search for characters...');
    const searchButton = screen.getByText('Search');

    await user.type(input, '  Rick  ');
    await user.click(searchButton);

    expect(mockOnSearch).toHaveBeenCalledWith('Rick');
  });
});
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        hasNext={false}
        hasPrev={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render pagination controls when totalPages > 1', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should call onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    await user.click(screen.getByText('2'));

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when Next button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    await user.click(screen.getByText('Next'));

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('should call onPageChange when Previous button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    await user.click(screen.getByText('Previous'));

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('should disable Previous button when hasPrev is false', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={false}
      />
    );

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('should disable Next button when hasNext is false', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={false}
        hasPrev={true}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('should highlight current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        hasNext={true}
        hasPrev={true}
      />
    );

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-blue-600', 'text-white');
  });
});
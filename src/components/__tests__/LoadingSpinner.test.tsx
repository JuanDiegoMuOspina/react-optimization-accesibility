import { render } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should have correct CSS classes', () => {
    render(<LoadingSpinner />);

    const container = document.querySelector('.flex.justify-center.items-center.p-8');
    const spinner = document.querySelector('.animate-spin.rounded-full.h-12.w-12.border-b-2.border-blue-600');
    
    expect(container).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
  });
});
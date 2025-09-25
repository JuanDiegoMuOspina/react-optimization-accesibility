import { render, screen } from '@testing-library/react';
import CharacterCard from '../CharacterCard';
import type { Character } from '../../types/api';

const mockCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: [],
  url: '',
  created: '2017-11-04T18:48:46.250Z'
};

describe('CharacterCard', () => {
  it('should render character information correctly', () => {
    render(<CharacterCard character={mockCharacter} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Alive - Human')).toBeInTheDocument();
    expect(screen.getByText('Gender:')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Origin:')).toBeInTheDocument();
    expect(screen.getByText('Earth (C-137)')).toBeInTheDocument();
    expect(screen.getByText('Location:')).toBeInTheDocument();
    expect(screen.getByText('Citadel of Ricks')).toBeInTheDocument();
  });

  it('should display character image with correct attributes', () => {
    render(<CharacterCard character={mockCharacter} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockCharacter.image);
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should show correct status color for alive character', () => {
    render(<CharacterCard character={mockCharacter} />);

    const statusIndicator = document.querySelector('.bg-green-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('should show correct status color for dead character', () => {
    const deadCharacter = { ...mockCharacter, status: 'Dead' as const };
    render(<CharacterCard character={deadCharacter} />);

    const statusIndicator = document.querySelector('.bg-red-500');
    expect(statusIndicator).toBeInTheDocument();
  });

  it('should show correct status color for unknown status', () => {
    const unknownCharacter = { ...mockCharacter, status: 'unknown' as const };
    render(<CharacterCard character={unknownCharacter} />);

    const statusIndicator = document.querySelector('.bg-gray-500');
    expect(statusIndicator).toBeInTheDocument();
  });
});
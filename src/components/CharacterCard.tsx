import React from 'react';
import { useTranslation } from 'react-i18next';
import type { Character } from '../types/api';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const { t } = useTranslation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Alive':
        return 'bg-green-500';
      case 'Dead':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img
        src={character.image}
        alt={character.name} // Alt text should be specific to the character
        className="w-full h-48 object-cover"
        loading="lazy"
      />
      <div className="p-4">
        <div className="text-xl font-bold text-gray-800 mb-2">{character.name}</div>
        <div className="flex items-center mb-2">
          <span className={`w-3 h-3 rounded-full ${getStatusColor(character.status)} mr-2`}></span>
          <span className="text-sm text-gray-600">{character.status} - {character.species}</span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div><span className="font-medium">{t('characterGender')}</span> {character.gender}</div>
          <div><span className="font-medium">{t('characterOrigin')}</span> {character.origin.name}</div>
          <div><span className="font-medium">{t('characterLocation')}</span> {character.location.name}</div>
        </div>
      </div>
    </div>
  );
};

export default CharacterCard;
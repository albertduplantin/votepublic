import React, { useState } from 'react';
import { Star, Clock, Users, Play, Heart } from 'lucide-react';

interface FilmCardProps {
  id: string;
  title: string;
  director: string;
  duration: number;
  year: number;
  country: string;
  synopsis: string;
  posterUrl?: string;
  rating?: number;
  voteCount?: number;
  isFavorite?: boolean;
  userVote?: number; // Vote de l'utilisateur actuel
  hasVoted?: boolean; // Si l'utilisateur a déjà voté
  onVote?: (rating: number) => void;
  onFavorite?: () => void;
  onClick?: () => void;
  className?: string;
}

export const FilmCard: React.FC<FilmCardProps> = ({
  title,
  director,
  duration,
  year,
  country,
  synopsis,
  posterUrl,
  rating = 0,
  voteCount = 0,
  isFavorite = false,
  userVote,
  hasVoted = false,
  onVote,
  onFavorite,
  onClick,
  className = ''
}) => {
  const [hovered, setHovered] = useState(false);
  const [localRating, setLocalRating] = useState(userVote || rating);

  const handleStarClick = (starRating: number) => {
    setLocalRating(starRating);
    onVote?.(starRating);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => (
      <button
        key={index}
        onClick={(e) => {
          e.stopPropagation();
          handleStarClick(index + 1);
        }}
        className={`star transition-all duration-200 ${
          index < localRating ? 'star-filled' : 'star-empty'
        } hover:scale-110`}
        aria-label={`Noter ${index + 1} étoile${index > 0 ? 's' : ''}`}
      >
        <Star className="w-5 h-5" fill={index < localRating ? 'currentColor' : 'none'} />
      </button>
    ));
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h${mins > 0 ? mins : ''}` : `${mins}min`;
  };

  return (
    <div
      className={`film-card-enhanced bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Image du film */}
      <div className="relative h-48 overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`Affiche de ${title}`}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: hovered ? 'scale(1.1)' : 'scale(1)'
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <Play className="w-12 h-12 text-primary-600" />
          </div>
        )}
        
        {/* Overlay au survol */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          hovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform transition-transform duration-300 ${
            hovered ? 'translate-y-0' : 'translate-y-full'
          }">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{formatDuration(duration)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite?.();
                }}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/20 text-white hover:bg-red-500'
                }`}
                aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>

        {/* Badge année */}
        <div className="absolute top-3 left-3">
          <span className="badge badge-primary text-xs font-medium">
            {year}
          </span>
        </div>

        {/* Badge pays */}
        <div className="absolute top-3 right-3">
          <span className="badge badge-secondary text-xs font-medium">
            {country}
          </span>
        </div>
      </div>

      {/* Contenu de la carte */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          Réalisé par {director}
        </p>

        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {synopsis}
        </p>

        {/* Métadonnées */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(duration)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{voteCount} vote{voteCount > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Système de notation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Votre note :</span>
            {hasVoted && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                ✓ Voté
              </span>
            )}
            {localRating > 0 && (
              <span className="text-sm text-primary-600 font-medium">
                {localRating}/5
              </span>
            )}
          </div>
          
          <div className="star-rating">
            {renderStars()}
          </div>
        </div>

        {/* Note moyenne si disponible */}
        {rating > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Note moyenne :</span>
              <div className="flex items-center space-x-1">
                <span className="font-medium text-gray-900">{rating.toFixed(1)}</span>
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { Search, Star } from 'lucide-react';
import { Film } from '../types';
import { getAllFilms } from '../services/filmService';
import { ERROR_MESSAGES } from '../utils/constants';
import toast from 'react-hot-toast';

export const FilmsPage: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Charger les films
  useEffect(() => {
    const loadFilms = async () => {
      try {
        const filmsData = await getAllFilms();
        setFilms(filmsData);
      } catch (error) {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      } finally {
        setLoading(false);
      }
    };

    loadFilms();
  }, []);

  // Filtrer les films selon la recherche
  const filteredFilms = films.filter(
    (film) =>
      film.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      film.realisateur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des films...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-primary-600">Films en compétition</h1>
            <p className="text-secondary-600 mt-1">
              Découvrez tous les films du Festival du Film Court de Dinan
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un film ou un réalisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {films.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun film disponible</h2>
            <p className="text-gray-600">Les films seront ajoutés par l'administrateur.</p>
          </div>
        ) : (
          <>
            {/* Statistiques */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredFilms.length} film{filteredFilms.length > 1 ? 's' : ''} trouvé{filteredFilms.length > 1 ? 's' : ''}
                {searchTerm && ` pour "${searchTerm}"`}
              </p>
            </div>

            {/* Grille des films */}
            <div className="films-grid">
              {filteredFilms.map((film) => (
                <div key={film.id} className="card hover:shadow-lg transition-shadow">
                  {film.posterUrl && (
                    <img
                      src={film.posterUrl}
                      alt={film.titre}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                  )}
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">{film.titre}</h3>
                    <p className="text-sm text-gray-600">
                      Réalisé par <span className="font-medium">{film.realisateur}</span>
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {film.synopsis}
                    </p>
                    
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>En compétition</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Ajouté le {new Date(film.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message si aucun résultat de recherche */}
            {searchTerm && filteredFilms.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun film trouvé
                </h3>
                <p className="text-gray-600">
                  Aucun film ne correspond à votre recherche "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-primary-600 hover:text-primary-500"
                >
                  Voir tous les films
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}; 
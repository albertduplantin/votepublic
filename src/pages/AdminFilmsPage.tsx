import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, Search, Filter } from 'lucide-react';
import { getAllFilms, deleteFilm } from '../services/filmService';
import { useNotifications } from '../hooks/useNotifications';
import { Film } from '../types';

export const AdminFilmsPage: React.FC = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const { showSuccess, showError } = useNotifications();

  const loadFilms = async () => {
    try {
      setLoading(true);
      const allFilms = await getAllFilms();
      setFilms(allFilms);
    } catch (error: any) {
      console.error('Erreur lors du chargement des films:', error);
      showError('Erreur de chargement', error.message || 'Impossible de charger les films');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilms();
  }, [loadFilms]);

  const handleDeleteFilm = async (filmId: string, filmTitle: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le film "${filmTitle}" ?`)) {
      try {
        await deleteFilm(filmId);
        setFilms(films.filter(film => film.id !== filmId));
        showSuccess('Film supprimé', `Le film "${filmTitle}" a été supprimé avec succès`);
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        showError('Erreur de suppression', error.message || 'Impossible de supprimer le film');
      }
    }
  };

  const filteredFilms = films.filter(film => {
    const matchesSearch = film.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         film.realisateur.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || film.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const genres = Array.from(new Set(films.map(film => film.genre))).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des films...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Gestion des Films</h1>
                  <p className="mt-1 text-gray-600">
                    Gérez les films du festival
                  </p>
                </div>
              </div>
              <Link
                to="/admin/films/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un film
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher par titre ou réalisateur..."
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                id="genre"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Tous les genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedGenre('');
                }}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Filter className="w-4 h-4 mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste des films */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Films ({filteredFilms.length})
            </h2>
          </div>
          
          {filteredFilms.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>Aucun film trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Film
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Réalisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Genre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Année
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFilms.map((film) => (
                    <tr key={film.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-8">
                            {film.posterUrl ? (
                              <img
                                className="h-12 w-8 object-cover rounded"
                                src={film.posterUrl}
                                alt={film.titre}
                              />
                            ) : (
                              <div className="h-12 w-8 bg-gray-200 rounded flex items-center justify-center">
                                <span className="text-xs text-gray-500">Aucune</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {film.titre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {film.pays}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {film.realisateur}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {film.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {film.duree} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {film.annee}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/films/edit/${film.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteFilm(film.id, film.titre)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
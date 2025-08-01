import React, { useState } from 'react';
import { X, Film, Plus, Trash2 } from 'lucide-react';
import { Film as FilmType, Seance, CreateSeanceData } from '../../types';
import { updateSeance } from '../../services/seanceService';
import toast from 'react-hot-toast';

interface EditSeanceModalProps {
  seance: Seance;
  films: FilmType[];
  onClose: () => void;
  onSuccess: (seance: Seance) => void;
}

export const EditSeanceModal: React.FC<EditSeanceModalProps> = ({
  seance,
  films,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateSeanceData>({
    nom: seance.nom,
    description: seance.description || '',
    date: seance.date,
    heure: seance.heure,
    films: [...seance.films],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.films.length !== 5) {
      toast.error('Une séance doit contenir exactement 5 films');
      return;
    }

    try {
      setLoading(true);
      await updateSeance(seance.id, formData);
      const updatedSeance = { ...seance, ...formData };
      onSuccess(updatedSeance);
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour de la séance');
    } finally {
      setLoading(false);
    }
  };

  const handleFilmToggle = (filmId: string) => {
    setFormData(prev => {
      const isSelected = prev.films.includes(filmId);
      if (isSelected) {
        return {
          ...prev,
          films: prev.films.filter(id => id !== filmId),
        };
      } else {
        if (prev.films.length >= 5) {
          toast.error('Une séance ne peut contenir que 5 films maximum');
          return prev;
        }
        return {
          ...prev,
          films: [...prev.films, filmId],
        };
      }
    });
  };

  const removeFilm = (filmId: string) => {
    setFormData(prev => ({
      ...prev,
      films: prev.films.filter(id => id !== filmId),
    }));
  };

  const selectedFilms = films.filter(film => formData.films.includes(film.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Modifier la séance</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la séance *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ex: Séance d'ouverture"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Description optionnelle de la séance"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date.toISOString().split('T')[0]}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.heure}
                    onChange={(e) => setFormData(prev => ({ ...prev, heure: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Films sélectionnés */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Films sélectionnés ({formData.films.length}/5)
              </label>
              
              {selectedFilms.length === 0 ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Film className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Aucun film sélectionné
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedFilms.map((film, index) => (
                    <div
                      key={film.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{film.titre}</p>
                          <p className="text-sm text-gray-500">{film.realisateur}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFilm(film.id)}
                        className="p-1 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Liste des films disponibles */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Films disponibles ({films.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
              {films.map((film) => {
                const isSelected = formData.films.includes(film.id);
                return (
                  <div
                    key={film.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary-50'
                        : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                    }`}
                    onClick={() => handleFilmToggle(film.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Plus className="w-3 h-3" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${
                          isSelected ? 'text-primary' : 'text-gray-900'
                        }`}>
                          {film.titre}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {film.realisateur}
                        </p>
                        <p className="text-xs text-gray-400">
                          {film.duree}min • {film.annee}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || formData.films.length !== 5}
              className="btn-festival disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, QrCode, Calendar, Clock, Film } from 'lucide-react';
import { Seance, Film as FilmType } from '../types';
import { getAllSeances, deleteSeance, toggleSeanceActive } from '../services/seanceService';
import { getAllFilms } from '../services/filmService';
import { CreateSeanceModal } from '../components/admin/CreateSeanceModal';
import { EditSeanceModal } from '../components/admin/EditSeanceModal';
import { SeanceDetailsModal } from '../components/admin/SeanceDetailsModal';
import toast from 'react-hot-toast';

export const AdminSeancesPage: React.FC = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [films, setFilms] = useState<FilmType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [seancesData, filmsData] = await Promise.all([
        getAllSeances(),
        getAllFilms(),
      ]);
      setSeances(seancesData);
      setFilms(filmsData);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les séances
  const filteredSeances = seances.filter(seance =>
    seance.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (seance.description && seance.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Supprimer une séance
  const handleDeleteSeance = async (seanceId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      return;
    }

    try {
      await deleteSeance(seanceId);
      setSeances(prev => prev.filter(s => s.id !== seanceId));
      toast.success('Séance supprimée avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Activer/désactiver une séance
  const handleToggleActive = async (seanceId: string, isActive: boolean) => {
    try {
      await toggleSeanceActive(seanceId, !isActive);
      setSeances(prev => prev.map(s => 
        s.id === seanceId ? { ...s, isActive: !isActive } : s
      ));
      toast.success(`Séance ${!isActive ? 'activée' : 'désactivée'} avec succès`);
    } catch (error) {
      toast.error('Erreur lors de la modification du statut');
    }
  };

  // Ouvrir le modal d'édition
  const handleEditSeance = (seance: Seance) => {
    setSelectedSeance(seance);
    setShowEditModal(true);
  };

  // Ouvrir le modal de détails
  const handleViewDetails = (seance: Seance) => {
    setSelectedSeance(seance);
    setShowDetailsModal(true);
  };

  // Récupérer les films d'une séance
  const getSeanceFilms = (seance: Seance) => {
    return films.filter(film => seance.films.includes(film.id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des séances...</p>
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
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Séances</h1>
                <p className="mt-1 text-gray-600">
                  Créez et gérez les séances de films du festival
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-festival flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle Séance</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une séance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Séances</p>
                <p className="text-2xl font-bold text-gray-900">{seances.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <Eye className="w-6 h-6 text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Séances Actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {seances.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Séances Inactives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {seances.filter(s => !s.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Film className="w-6 h-6 text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Films</p>
                <p className="text-2xl font-bold text-gray-900">{films.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des séances */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Séances ({filteredSeances.length})</h2>
          </div>
          
          {filteredSeances.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Film className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune séance</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Aucune séance ne correspond à votre recherche.' : 'Commencez par créer une séance.'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-festival"
                  >
                    Créer une séance
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSeances.map((seance) => {
                const seanceFilms = getSeanceFilms(seance);
                return (
                  <div key={seance.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-medium text-gray-900">{seance.nom}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            seance.isActive 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {seance.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        {seance.description && (
                          <p className="mt-1 text-sm text-gray-600">{seance.description}</p>
                        )}
                        
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{seance.date.toLocaleDateString('fr-FR')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{seance.heure}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Film className="w-4 h-4" />
                            <span>{seanceFilms.length} films</span>
                          </div>
                        </div>
                        
                        {/* Films de la séance */}
                        <div className="mt-3">
                          <div className="flex flex-wrap gap-2">
                            {seanceFilms.map((film) => (
                              <span
                                key={film.id}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {film.titre}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleViewDetails(seance)}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleEditSeance(seance)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleToggleActive(seance.id, seance.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            seance.isActive
                              ? 'text-warning-400 hover:text-warning-600 hover:bg-warning-50'
                              : 'text-success-400 hover:text-success-600 hover:bg-success-50'
                          }`}
                          title={seance.isActive ? 'Désactiver' : 'Activer'}
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSeance(seance.id)}
                          className="p-2 text-gray-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateSeanceModal
          films={films}
          onClose={() => setShowCreateModal(false)}
          onSuccess={(newSeance) => {
            setSeances(prev => [newSeance, ...prev]);
            setShowCreateModal(false);
            toast.success('Séance créée avec succès');
          }}
        />
      )}

      {showEditModal && selectedSeance && (
        <EditSeanceModal
          seance={selectedSeance}
          films={films}
          onClose={() => {
            setShowEditModal(false);
            setSelectedSeance(null);
          }}
          onSuccess={(updatedSeance) => {
            setSeances(prev => prev.map(s => s.id === updatedSeance.id ? updatedSeance : s));
            setShowEditModal(false);
            setSelectedSeance(null);
            toast.success('Séance mise à jour avec succès');
          }}
        />
      )}

      {showDetailsModal && selectedSeance && (
        <SeanceDetailsModal
          seance={selectedSeance}
          films={getSeanceFilms(selectedSeance)}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSeance(null);
          }}
        />
      )}
    </div>
  );
}; 
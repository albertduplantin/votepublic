import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Database, Download, Upload, Trash2, RefreshCw, Shield } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';

export const AdminDatabasePage: React.FC = () => {
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      // Simulation de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess('Sauvegarde créée', 'La sauvegarde de la base de données a été créée avec succès');
    } catch (error) {
      showError('Erreur de sauvegarde', 'Impossible de créer la sauvegarde');
    } finally {
      setBackupLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir restaurer la base de données ? Cette action écrasera toutes les données actuelles.')) {
      return;
    }
    
    setRestoreLoading(true);
    try {
      // Simulation de restauration
      await new Promise(resolve => setTimeout(resolve, 3000));
      showSuccess('Base restaurée', 'La base de données a été restaurée avec succès');
    } catch (error) {
      showError('Erreur de restauration', 'Impossible de restaurer la base de données');
    } finally {
      setRestoreLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir nettoyer la base de données ? Cette action supprimera les données obsolètes.')) {
      return;
    }
    
    try {
      // Simulation de nettoyage
      await new Promise(resolve => setTimeout(resolve, 1500));
      showSuccess('Nettoyage terminé', 'La base de données a été nettoyée avec succès');
    } catch (error) {
      showError('Erreur de nettoyage', 'Impossible de nettoyer la base de données');
    }
  };

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
                  <h1 className="text-3xl font-bold text-gray-900">Base de Données</h1>
                  <p className="mt-1 text-gray-600">
                    Sauvegardes et maintenance de la base de données
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taille de la DB</p>
                <p className="text-2xl font-bold text-gray-900">2.4 MB</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sauvegardes</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dernière sauvegarde</p>
                <p className="text-2xl font-bold text-gray-900">Aujourd'hui</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Statut</p>
                <p className="text-2xl font-bold text-gray-900">Sain</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sauvegarde */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Download className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Sauvegarde</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Créez une sauvegarde complète de la base de données. Cette sauvegarde inclut tous les films, séances, votes et utilisateurs.
            </p>
            <button
              onClick={handleBackup}
              disabled={backupLoading}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {backupLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Créer une sauvegarde
                </>
              )}
            </button>
          </div>

          {/* Restauration */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Upload className="w-6 h-6 text-green-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Restauration</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Restaurez la base de données à partir d'une sauvegarde précédente. Attention : cette action écrasera toutes les données actuelles.
            </p>
            <button
              onClick={handleRestore}
              disabled={restoreLoading}
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {restoreLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Restauration en cours...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Restaurer la base
                </>
              )}
            </button>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center mb-4">
            <RefreshCw className="w-6 h-6 text-yellow-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Maintenance</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Nettoyage</h4>
              <p className="text-sm text-gray-600 mb-3">
                Supprime les données obsolètes et optimise les performances.
              </p>
              <button
                onClick={handleCleanup}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Nettoyer
              </button>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Vérification</h4>
              <p className="text-sm text-gray-600 mb-3">
                Vérifie l'intégrité de la base de données.
              </p>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <Shield className="w-4 h-4 mr-2" />
                Vérifier
              </button>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Optimisation</h4>
              <p className="text-sm text-gray-600 mb-3">
                Optimise les index et améliore les performances.
              </p>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <RefreshCw className="w-4 h-4 mr-2" />
                Optimiser
              </button>
            </div>
          </div>
        </div>

        {/* Historique des sauvegardes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Historique des sauvegardes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taille
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    20/01/2024 14:30
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2.4 MB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Complète
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Réussie
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Télécharger
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Supprimer
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    19/01/2024 14:30
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2.1 MB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Complète
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Réussie
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Télécharger
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Supprimer
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}; 
import React from 'react';
import { Settings, Film, Users, BarChart3 } from 'lucide-react';

export const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-primary-600">Administration</h1>
            <p className="text-secondary-600 mt-1">
              Gestion du Festival du Film Court de Dinan
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚙️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Interface d'administration</h2>
          <p className="text-gray-600 mb-8">
            Cette page sera développée pour la gestion complète des films et des votes.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <Film className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Gestion des films</h3>
              <p className="text-sm text-gray-600">Ajouter, modifier, supprimer des films</p>
            </div>
            
            <div className="card text-center">
              <BarChart3 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Résultats</h3>
              <p className="text-sm text-gray-600">Visualiser les votes en temps réel</p>
            </div>
            
            <div className="card text-center">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Utilisateurs</h3>
              <p className="text-sm text-gray-600">Gérer les comptes utilisateurs</p>
            </div>
            
            <div className="card text-center">
              <Settings className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Paramètres</h3>
              <p className="text-sm text-gray-600">Configuration du système</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
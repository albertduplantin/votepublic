import React from 'react';
import { BarChart3, Star, Users } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-primary-600">Résultats du vote</h1>
            <p className="text-secondary-600 mt-1">
              Découvrez les films les plus appréciés du festival
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Résultats en temps réel</h2>
          <p className="text-gray-600 mb-8">
            Cette page affichera les résultats des votes en temps réel.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <BarChart3 className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Classement</h3>
              <p className="text-sm text-gray-600">Films classés par popularité</p>
            </div>
            
            <div className="card text-center">
              <Star className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Notes moyennes</h3>
              <p className="text-sm text-gray-600">Moyennes des notes par film</p>
            </div>
            
            <div className="card text-center">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Participation</h3>
              <p className="text-sm text-gray-600">Nombre total de votes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
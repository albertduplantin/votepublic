import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, BarChart3 } from 'lucide-react';
import { ResultsPage } from './ResultsPage';

export const AdminResultsPage: React.FC = () => {
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
                  <h1 className="text-3xl font-bold text-gray-900">Résultats des Votes</h1>
                  <p className="mt-1 text-gray-600">
                    Visualisez les résultats en temps réel et exportez les données
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Rapports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal - Réutilisation de la page ResultsPage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResultsPage />
      </div>
    </div>
  );
}; 
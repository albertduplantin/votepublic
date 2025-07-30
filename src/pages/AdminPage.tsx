import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Film, Users, BarChart3, Calendar, QrCode, Database, Shield } from 'lucide-react';
import { ROUTES } from '../utils/constants';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const adminFeatures = [
    {
      id: 'seances',
      title: 'Gestion des Séances',
      description: 'Créez et gérez les séances de films avec génération automatique de QR codes',
      icon: Calendar,
      color: 'primary',
      href: '/admin/seances',
    },
    {
      id: 'films',
      title: 'Gestion des Films',
      description: 'Ajoutez, modifiez et supprimez les films du festival',
      icon: Film,
      color: 'secondary',
      href: '/admin/films',
    },
    {
      id: 'votes',
      title: 'Résultats des Votes',
      description: 'Visualisez les résultats en temps réel et exportez les données',
      icon: BarChart3,
      color: 'success',
      href: '/admin/results',
    },
    {
      id: 'users',
      title: 'Gestion des Utilisateurs',
      description: 'Gérez les comptes utilisateurs et les permissions',
      icon: Users,
      color: 'info',
      href: '/admin/users',
    },
    {
      id: 'qr-codes',
      title: 'QR Codes',
      description: 'Générez et gérez les QR codes pour les séances',
      icon: QrCode,
      color: 'warning',
      href: '/admin/qr-codes',
    },
    {
      id: 'database',
      title: 'Base de Données',
      description: 'Sauvegardes et maintenance de la base de données',
      icon: Database,
      color: 'error',
      href: '/admin/database',
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Paramètres de sécurité et logs d\'accès',
      icon: Shield,
      color: 'gray',
      href: '/admin/security',
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration générale de l\'application',
      icon: Settings,
      color: 'gray',
      href: '/admin/settings',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: 'bg-primary-50 text-primary-600 border-primary-200',
      secondary: 'bg-secondary-50 text-secondary-600 border-secondary-200',
      success: 'bg-success-50 text-success-600 border-success-200',
      warning: 'bg-warning-50 text-warning-600 border-warning-200',
      error: 'bg-error-50 text-error-600 border-error-200',
      info: 'bg-info-50 text-info-600 border-info-200',
      gray: 'bg-gray-50 text-gray-600 border-gray-200',
    };
    return colorMap[color] || colorMap.gray;
  };

  const getHoverColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      primary: 'hover:bg-primary-100 hover:border-primary-300',
      secondary: 'hover:bg-secondary-100 hover:border-secondary-300',
      success: 'hover:bg-success-100 hover:border-success-300',
      warning: 'hover:bg-warning-100 hover:border-warning-300',
      error: 'hover:bg-error-100 hover:border-error-300',
      info: 'hover:bg-info-100 hover:border-info-300',
      gray: 'hover:bg-gray-100 hover:border-gray-300',
    };
    return colorMap[color] || colorMap.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
                <p className="mt-1 text-gray-600">
                  Gestion complète du Festival du Film Court de Dinan
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Séances</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Film className="w-6 h-6 text-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Films</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-success-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-success" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Votes</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-info-100 rounded-lg">
                <Users className="w-6 h-6 text-info" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fonctionnalités d'administration */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Fonctionnalités d'administration</h2>
            <p className="text-sm text-gray-600 mt-1">
              Accédez aux différentes sections de gestion
            </p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Link
                    key={feature.id}
                    to={feature.href}
                    className={`group block p-6 border-2 rounded-lg transition-all duration-200 ${getColorClasses(feature.color)} ${getHoverColorClasses(feature.color)}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                        <p className="text-sm opacity-75">{feature.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Actions rapides</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/seances"
                className="btn-festival text-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Créer une séance
              </Link>
              
              <Link
                to="/admin/films"
                className="btn-festival-outline text-center"
              >
                <Film className="w-5 h-5 mr-2" />
                Ajouter un film
              </Link>
              
              <Link
                to="/admin/results"
                className="btn-festival-outline text-center"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Voir les résultats
              </Link>
            </div>
          </div>
        </div>

        {/* Informations système */}
        <div className="mt-8 bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Informations système</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Statut des services</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Base de données</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Connecté
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Authentification</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Actif
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Stockage</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Disponible
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Dernières activités</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Aucune activité récente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
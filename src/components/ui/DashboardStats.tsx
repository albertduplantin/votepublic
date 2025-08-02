import React from 'react';
import { DashboardStats as DashboardStatsType } from '../../services/dashboardService';

interface DashboardStatsProps {
  stats: DashboardStatsType;
  className?: string;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des votes par jour */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Votes par jour (7 derniers jours)</h3>
          {stats.votesByDay && stats.votesByDay.length > 0 ? (
            <div className="space-y-3">
              {stats.votesByDay.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{day.date}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max((day.count / Math.max(...stats.votesByDay!.map(d => d.count))) * 100, 5)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucun vote enregistré</p>
          )}
        </div>

        {/* Répartition par genre */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par genre</h3>
          {stats.filmsByGenre && Object.keys(stats.filmsByGenre).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.filmsByGenre).map(([genre, count]) => (
                <div key={genre} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{genre}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.max((count / Math.max(...Object.values(stats.filmsByGenre!))) * 100, 5)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Aucun film enregistré</p>
          )}
        </div>
      </div>

      {/* Métriques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taux de participation</p>
              <p className="text-2xl font-bold text-gray-900">{stats.participationRate}%</p>
            </div>
            <div className="p-3 bg-success-100 rounded-lg">
              <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span>Basé sur {stats.totalSeances} séances</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs uniques</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-info-100 rounded-lg">
              <svg className="w-6 h-6 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span>Ayant participé au vote</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Séances totales</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSeances}</p>
            </div>
            <div className="p-3 bg-warning-100 rounded-lg">
              <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <span>{stats.activeSeances} actives</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
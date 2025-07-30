import React from 'react';
import { Users, Film, Star, TrendingUp, Award, Calendar } from 'lucide-react';
import { StatsCard } from './StatsCard';

interface DashboardStats {
  totalVotes: number;
  totalFilms: number;
  averageRating: number;
  activeSeances: number;
  topFilm?: {
    title: string;
    rating: number;
    votes: number;
  } | undefined;
  recentActivity?: Array<{
    id: string;
    action: string;
    film: string;
    timestamp: Date;
  }>;
}

interface DashboardProps {
  stats: DashboardStats;
  loading?: boolean;
  className?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  loading = false,
  className = ''
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="stats-card animate-pulse">
              <div className="skeleton h-6 w-24 mb-4"></div>
              <div className="skeleton h-10 w-16 mb-2"></div>
              <div className="skeleton h-4 w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total des votes"
          value={formatNumber(stats.totalVotes)}
          icon={<Users className="w-5 h-5" />}
          color="primary"
        />
        
        <StatsCard
          title="Films en compétition"
          value={stats.totalFilms}
          icon={<Film className="w-5 h-5" />}
          color="secondary"
        />
        
        <StatsCard
          title="Note moyenne"
          value={stats.averageRating.toFixed(1)}
          icon={<Star className="w-5 h-5" />}
          color="success"
        />
        
        <StatsCard
          title="Séances actives"
          value={stats.activeSeances}
          icon={<Calendar className="w-5 h-5" />}
          color="warning"
        />
      </div>

      {/* Film en tête */}
      {stats.topFilm && (
        <div className="card-hover">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="w-5 h-5 text-yellow-500 mr-2" />
              Film en tête
            </h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {stats.topFilm.title}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                    {stats.topFilm.rating.toFixed(1)}/5
                  </span>
                  <span className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {formatNumber(stats.topFilm.votes)} votes
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-600">
                  #{1}
                </div>
                <div className="text-xs text-gray-500">
                  Classement
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activité récente */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <div className="card-hover">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Activité récente
          </h3>
          
          <div className="space-y-3">
            {stats.recentActivity.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.action}</span>
                    {' '}pour{' '}
                    <span className="font-medium text-primary-600">{activity.film}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {stats.recentActivity.length > 5 && (
            <div className="mt-4 text-center">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Voir toute l'activité
              </button>
            </div>
          )}
        </div>
      )}

      {/* Graphique de progression (placeholder) */}
      <div className="card-hover">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Progression des votes
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Objectif : 1000 votes</span>
            <span className="text-sm text-gray-500">
              {Math.round((stats.totalVotes / 1000) * 100)}%
            </span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${Math.min((stats.totalVotes / 1000) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <span className="text-sm text-gray-600">
              {stats.totalVotes} votes sur 1000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
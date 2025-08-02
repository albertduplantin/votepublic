import { useState, useEffect, useCallback } from 'react';
import { getDashboardStats, DashboardStats } from '../services/dashboardService';
import { useNotifications } from './useNotifications';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
      showSuccess('Statistiques chargées', 'Les données du tableau de bord ont été mises à jour');
    } catch (error: any) {
      console.error('Erreur lors du chargement des statistiques:', error);
      showError('Erreur de chargement', error.message || 'Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const refreshStats = useCallback(async () => {
    try {
      setRefreshing(true);
      const dashboardStats = await getDashboardStats();
      setStats(dashboardStats);
      showSuccess('Statistiques actualisées', 'Les données ont été mises à jour');
    } catch (error: any) {
      console.error('Erreur lors de l\'actualisation:', error);
      showError('Erreur d\'actualisation', error.message || 'Impossible d\'actualiser les statistiques');
    } finally {
      setRefreshing(false);
    }
  }, [showSuccess, showError]);

  // Charger les statistiques au montage du composant
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Actualisation automatique toutes les 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        refreshStats();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [loading, refreshing, refreshStats]);

  return {
    stats,
    loading,
    refreshing,
    loadStats,
    refreshStats
  };
}; 
import { getAllFilms } from './filmService';
import { getAllSeances } from './seanceService';
import { getAllVotes } from './voteService';

export interface DashboardStats {
  totalVotes: number;
  totalFilms: number;
  totalSeances: number;
  totalUsers: number;
  averageRating: number;
  activeSeances: number;
  topFilm?: {
    id: string;
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
  votesByDay?: Array<{
    date: string;
    count: number;
  }>;
  filmsByGenre?: Record<string, number>;
  participationRate: number;
}

/**
 * Récupérer toutes les statistiques du tableau de bord
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    console.log('Chargement des statistiques du tableau de bord...');

    // Charger toutes les données en parallèle
    const [allVotes, allFilms, allSeances] = await Promise.all([
      getAllVotes(),
      getAllFilms(),
      getAllSeances()
    ]);

    console.log(`Données chargées: ${allVotes.length} votes, ${allFilms.length} films, ${allSeances.length} séances`);

    // Calculer les statistiques de base
    const totalVotes = allVotes.length;
    const totalFilms = allFilms.length;
    const totalSeances = allSeances.length;
    const activeSeances = allSeances.filter(seance => seance.isActive).length;

    // Calculer la note moyenne globale
    const averageRating = totalVotes > 0 
      ? Math.round((allVotes.reduce((sum, vote) => sum + vote.note, 0) / totalVotes) * 10) / 10
      : 0;

    // Trouver le film en tête
    const filmStats = new Map<string, { votes: number; totalRating: number }>();
    
    allVotes.forEach(vote => {
      if (!filmStats.has(vote.filmId)) {
        filmStats.set(vote.filmId, { votes: 0, totalRating: 0 });
      }
      const stats = filmStats.get(vote.filmId)!;
      stats.votes += 1;
      stats.totalRating += vote.note;
    });

    let topFilm: DashboardStats['topFilm'] | undefined;
    let maxRating = 0;

    for (const [filmId, stats] of filmStats) {
      const film = allFilms.find(f => f.id === filmId);
      if (film && stats.votes > 0) {
        const rating = stats.totalRating / stats.votes;
        if (rating > maxRating) {
          maxRating = rating;
          topFilm = {
            id: filmId,
            title: film.titre,
            rating: Math.round(rating * 10) / 10,
            votes: stats.votes
          };
        }
      }
    }

    // Calculer les statistiques par genre
    const filmsByGenre: Record<string, number> = {};
    allFilms.forEach(film => {
      filmsByGenre[film.genre] = (filmsByGenre[film.genre] || 0) + 1;
    });

    // Calculer l'activité récente (derniers votes)
    const recentVotes = allVotes
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);

    const recentActivity = recentVotes.map(vote => {
      const film = allFilms.find(f => f.id === vote.filmId);
      return {
        id: vote.id,
        action: `Vote ${vote.note}/5`,
        film: film?.titre || 'Film inconnu',
        timestamp: vote.createdAt
      };
    });

    // Calculer les votes par jour (7 derniers jours)
    const votesByDay: Array<{ date: string; count: number }> = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayVotes = allVotes.filter(vote => {
        const voteDate = vote.createdAt.toISOString().split('T')[0];
        return voteDate === dateStr;
      });
      
      votesByDay.push({
        date: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' }),
        count: dayVotes.length
      });
    }

    // Calculer le taux de participation (estimation)
    const participationRate = totalSeances > 0 
      ? Math.round((totalVotes / (totalSeances * 50)) * 100) // Estimation de 50 votes par séance
      : 0;

    // Récupérer le nombre d'utilisateurs (approximatif)
    const uniqueUsers = new Set(allVotes.map(vote => vote.userId).filter(Boolean));
    const totalUsers = uniqueUsers.size;

    const stats: DashboardStats = {
      totalVotes,
      totalFilms,
      totalSeances,
      totalUsers,
      averageRating,
      activeSeances,
      topFilm,
      recentActivity,
      votesByDay,
      filmsByGenre,
      participationRate
    };

    console.log('Statistiques calculées:', stats);
    return stats;

  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error);
    throw new Error('Impossible de charger les statistiques du tableau de bord');
  }
};

/**
 * Récupérer les statistiques en temps réel (pour les mises à jour)
 */
export const getRealTimeStats = async (): Promise<Partial<DashboardStats>> => {
  try {
    const [allVotes, allSeances] = await Promise.all([
      getAllVotes(),
      getAllSeances()
    ]);

    return {
      totalVotes: allVotes.length,
      activeSeances: allSeances.filter(seance => seance.isActive).length,
      participationRate: allSeances.length > 0 
        ? Math.round((allVotes.length / (allSeances.length * 50)) * 100)
        : 0
    };
  } catch (error) {
    console.error('Erreur lors du chargement des stats temps réel:', error);
    throw error;
  }
}; 
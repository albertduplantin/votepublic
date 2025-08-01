import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { getAllSeances } from '../services/seanceService';
import { getSeanceResults, getAllVotes } from '../services/voteService';
import { getFilmById, getFilmsByIds, getAllFilms } from '../services/filmService';
import { Seance, Vote } from '../types';
import { Dashboard, FilmCard } from '../components/ui';
import { useNotificationContext } from '../contexts/NotificationContext';

interface FilmResult {
  filmId: string;
  titre: string;
  realisateur: string;
  posterUrl: string;
  totalVotes: number;
  moyenneNote: number;
  distributionNotes: Record<number, number>;
  position: number;
}

interface SeanceResult {
  seance: Seance;
  films: FilmResult[];
  totalVotes: number;
  participationRate: number;
}

export const ResultsPage: React.FC = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [selectedSeance, setSelectedSeance] = useState<string>('all');
  const [results, setResults] = useState<SeanceResult[]>([]);
  const [globalResults, setGlobalResults] = useState<FilmResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'votes' | 'rating' | 'name'>('rating');
  const { showError, showSuccess } = useNotificationContext();

  // Charger les séances et résultats
  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Début du chargement des résultats...');

      // Charger toutes les séances et tous les films
      const [allSeances, allFilms, allVotes] = await Promise.all([
        getAllSeances(),
        getAllFilms(),
        getAllVotes()
      ]);

      console.log(`Séances trouvées: ${allSeances.length}`);
      console.log(`Films trouvés: ${allFilms.length}`);
      console.log(`Votes trouvés: ${allVotes.length}`);

      setSeances(allSeances);

      // Créer un map des films pour un accès rapide
      const filmsMap = new Map(allFilms.map(film => [film.id, film]));

      // Calculer les statistiques globales par film
      const filmStats = new Map<string, { votes: Vote[]; totalRating: number; count: number }>();
      
      allVotes.forEach(vote => {
        if (!filmStats.has(vote.filmId)) {
          filmStats.set(vote.filmId, { votes: [], totalRating: 0, count: 0 });
        }
        const stats = filmStats.get(vote.filmId)!;
        stats.votes.push(vote);
        stats.totalRating += vote.note;
        stats.count += 1;
      });

      console.log(`Films avec votes: ${filmStats.size}`);

      // Créer les résultats globaux
      const globalFilms: FilmResult[] = [];
      for (const [filmId, stats] of filmStats) {
        const film = filmsMap.get(filmId);
        if (film && stats.count > 0) {
          const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          stats.votes.forEach(vote => {
            if (vote.note >= 1 && vote.note <= 5) {
              distribution[vote.note]++;
            }
          });

          globalFilms.push({
            filmId,
            titre: film.titre,
            realisateur: film.realisateur,
            posterUrl: film.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
            totalVotes: stats.count,
            moyenneNote: Math.round((stats.totalRating / stats.count) * 10) / 10,
            distributionNotes: distribution,
            position: 0,
          });
        }
      }

      // Trier et positionner les films globaux
      const sortedGlobalFilms = globalFilms.sort((a, b) => b.moyenneNote - a.moyenneNote);
      sortedGlobalFilms.forEach((film, index) => {
        film.position = index + 1;
      });

      setGlobalResults(sortedGlobalFilms);

      // Calculer les résultats par séance
      const seanceResults: SeanceResult[] = [];
      for (const seance of allSeances) {
        const seanceFilms: FilmResult[] = [];
        
        // Pour chaque film de la séance, récupérer ses statistiques
        for (const filmId of seance.films) {
          const stats = filmStats.get(filmId);
          const film = filmsMap.get(filmId);
          
          if (stats && film && stats.count > 0) {
            const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            stats.votes.forEach(vote => {
              if (vote.note >= 1 && vote.note <= 5) {
                distribution[vote.note]++;
              }
            });

            seanceFilms.push({
              filmId,
              titre: film.titre,
              realisateur: film.realisateur,
              posterUrl: film.posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
              totalVotes: stats.count,
              moyenneNote: Math.round((stats.totalRating / stats.count) * 10) / 10,
              distributionNotes: distribution,
              position: 0,
            });
          }
        }

        // Trier et positionner les films de la séance
        const sortedSeanceFilms = seanceFilms.sort((a, b) => b.moyenneNote - a.moyenneNote);
        sortedSeanceFilms.forEach((film, index) => {
          film.position = index + 1;
        });

        const totalSeanceVotes = sortedSeanceFilms.reduce((sum, film) => sum + film.totalVotes, 0);

        seanceResults.push({
          seance,
          films: sortedSeanceFilms,
          totalVotes: totalSeanceVotes,
          participationRate: Math.round((totalSeanceVotes / 50) * 100), // Estimation
        });
      }

      setResults(seanceResults);

      console.log('Résultats chargés avec succès');
      showSuccess('Résultats chargés', 'Les résultats ont été mis à jour avec succès');

    } catch (error) {
      console.error('Erreur lors du chargement des résultats:', error);
      setError('Erreur lors du chargement des résultats');
      showError('Erreur de chargement', 'Impossible de charger les résultats');
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques globales
  const getGlobalStats = () => {
    const totalVotes = globalResults.reduce((sum, film) => sum + film.totalVotes, 0);
    const averageRating = globalResults.length > 0 
      ? globalResults.reduce((sum, film) => sum + film.moyenneNote, 0) / globalResults.length 
      : 0;
    const activeSeances = seances.filter(s => new Date(s.date) > new Date()).length;

    return {
      totalVotes,
      totalFilms: globalResults.length,
      averageRating,
      activeSeances,
      topFilm: globalResults.length > 0 ? {
        title: globalResults[0].titre,
        rating: globalResults[0].moyenneNote,
        votes: globalResults[0].totalVotes
      } : undefined
    };
  };

  const sortFilms = (films: FilmResult[], sortType: 'votes' | 'rating' | 'name'): FilmResult[] => {
    switch (sortType) {
      case 'votes':
        return [...films].sort((a, b) => b.totalVotes - a.totalVotes);
      case 'rating':
        return [...films].sort((a, b) => b.moyenneNote - a.moyenneNote);
      case 'name':
        return [...films].sort((a, b) => a.titre.localeCompare(b.titre));
      default:
        return films;
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const getPositionBadge = (position: number): JSX.Element => {
    let badgeClass = 'badge ';
    let icon = null;

    switch (position) {
      case 1:
        badgeClass += 'bg-yellow-100 text-yellow-800';
        icon = <Award className="w-3 h-3" />;
        break;
      case 2:
        badgeClass += 'bg-gray-100 text-gray-800';
        icon = <Award className="w-3 h-3" />;
        break;
      case 3:
        badgeClass += 'bg-orange-100 text-orange-800';
        icon = <Award className="w-3 h-3" />;
        break;
      default:
        badgeClass += 'bg-gray-100 text-gray-600';
    }

    return (
      <span className={badgeClass}>
        {icon && <span className="mr-1">{icon}</span>}
        #{position}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur de chargement</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadResults}
              className="btn-primary"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentResults = selectedSeance === 'all' 
    ? globalResults 
    : results.find(r => r.seance.id === selectedSeance)?.films || [];

  const sortedResults = sortFilms(currentResults, sortBy);
  const globalStats = getGlobalStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Résultats du Prix du Public
          </h1>
          <p className="text-gray-600">
            Découvrez les films les plus appréciés par le public
          </p>
        </div>

        {/* Tableau de bord des statistiques */}
        <div className="mb-8">
          <Dashboard stats={globalStats} />
        </div>

        {/* Filtres et contrôles */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Séance :</label>
              <select
                value={selectedSeance}
                onChange={(e) => setSelectedSeance(e.target.value)}
                className="input-field max-w-xs"
              >
                <option value="all">Toutes les séances</option>
                {seances.map((seance) => (
                  <option key={seance.id} value={seance.id}>
                    {seance.nom} - {formatDate(seance.date)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Trier par :</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'votes' | 'rating' | 'name')}
                className="input-field max-w-xs"
              >
                <option value="rating">Note moyenne</option>
                <option value="votes">Nombre de votes</option>
                <option value="name">Nom du film</option>
              </select>
            </div>
          </div>
        </div>

        {/* Résultats */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Classement {selectedSeance === 'all' ? 'global' : 'de la séance'}
          </h2>

          {sortedResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun résultat disponible
              </h3>
              <p className="text-gray-600">
                Les votes n'ont pas encore commencé ou aucun vote n'a été enregistré.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedResults.map((film) => (
                <div key={film.filmId} className="relative">
                  <FilmCard
                    id={film.filmId}
                    title={film.titre}
                    director={film.realisateur}
                    duration={0} // À récupérer depuis les données du film
                    year={2024} // À récupérer depuis les données du film
                    country="France" // À récupérer depuis les données du film
                    synopsis="Synopsis non disponible" // À récupérer depuis les données du film
                    posterUrl={film.posterUrl}
                    rating={film.moyenneNote}
                    voteCount={film.totalVotes}
                    className="h-full"
                  />
                  
                  {/* Badge de position */}
                  <div className="absolute top-4 left-4 z-10">
                    {getPositionBadge(film.position)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 
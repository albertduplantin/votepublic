import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import toast from 'react-hot-toast';
import { Star, ArrowLeft, Send, Clock, Users } from 'lucide-react';
import { getSeanceById } from '../services/seanceService';
import { getSeanceResults, getUserVoteForFilm } from '../services/voteService';
import { getAllFilms } from '../services/filmService';
import { addVote } from '../services/voteService';
import { Seance, Film } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FilmCard } from '../components/ui/FilmCard';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';

interface VoteData {
  filmId: string;
  note: number;
  commentaire?: string;
}

export const SeanceVotePage: React.FC = () => {
  const { seanceId } = useParams<{ seanceId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seance, setSeance] = useState<Seance | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [votes, setVotes] = useState<Record<string, VoteData>>({});
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  // Charger les données de la séance
  useEffect(() => {
    const loadSeanceData = async () => {
      if (!seanceId) return;
      
      try {
        setLoading(true);
        const [seanceData, filmsData, resultsData] = await Promise.all([
          getSeanceById(seanceId),
          getAllFilms(),
          getSeanceResults(seanceId),
        ]);
        
        setSeance(seanceData);
        setFilms(filmsData);
        setResults(resultsData);

        // Charger les votes existants de l'utilisateur
        if (seanceData && user) {
          const userVotesData: Record<string, number> = {};
          for (const filmId of seanceData.films) {
            try {
              const userVote = await getUserVoteForFilm(filmId, user.uid);
              if (userVote) {
                userVotesData[filmId] = userVote.note;
                // Pré-remplir les votes avec les données existantes
                setVotes(prev => ({
                  ...prev,
                  [filmId]: {
                    filmId,
                    note: userVote.note,
                    ...(userVote.commentaire && { commentaire: userVote.commentaire })
                  }
                }));
              }
            } catch (error) {
              console.error(`Erreur lors du chargement du vote pour le film ${filmId}:`, error);
            }
          }
          setUserVotes(userVotesData);
        }
      } catch (error: any) {
        toast.error('Erreur lors du chargement de la séance');
        navigate(ROUTES.VOTE);
      } finally {
        setLoading(false);
      }
    };

    loadSeanceData();
  }, [seanceId, navigate]);

  // Gérer le vote pour un film
  const handleVote = (filmId: string, note: number, commentaire?: string) => {
    setVotes(prev => ({
      ...prev,
      [filmId]: commentaire !== undefined
        ? { filmId, note, commentaire }
        : { filmId, note }
    }));
  };

  // Soumettre tous les votes
  const handleSubmitVotes = async () => {
    if (!seance || Object.keys(votes).length === 0) {
      toast.error('Veuillez voter pour au moins un film');
      return;
    }

    try {
      setVoting(true);
      
      // Soumettre chaque vote
      const votePromises = Object.values(votes).map(vote => 
        addVote({
          filmId: vote.filmId,
          seanceId: seance.id,
          note: vote.note,
          ...(user?.uid && { userId: user.uid }),
          ...(vote.commentaire !== undefined ? { commentaire: vote.commentaire } : {})
        })
      );
      
      await Promise.all(votePromises);
      
      toast.success('Votes enregistrés avec succès !');
      navigate(ROUTES.RESULTS);
    } catch (error: any) {
      toast.error('Erreur lors de l\'enregistrement des votes');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la séance...</p>
        </div>
      </div>
    );
  }

  if (!seance) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Séance non trouvée</h2>
          <Button onClick={() => navigate(ROUTES.VOTE)}>
            Retour au vote
          </Button>
        </div>
      </div>
    );
  }

  // Filtrer les films de cette séance
  const seanceFilms = films.filter(film => seance.films.includes(film.id));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <Button
            variant="ghost"
            icon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.VOTE)}
            className="mb-4"
          >
            Retour
          </Button>
          
          <Card className="mb-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {seance.nom}
              </h1>
              <div className="flex items-center justify-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{seance.date.toLocaleDateString('fr-FR')} à {seance.heure}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{seanceFilms.length} film{seanceFilms.length > 1 ? 's' : ''}</span>
                </div>
              </div>
              {seance.description && (
                <p className="mt-4 text-gray-600">{seance.description}</p>
              )}
            </div>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mb-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Votez pour les films de cette séance
            </h2>
            <p className="text-gray-600 mb-4">
              Notez chaque film de 1 à 5 étoiles et ajoutez un commentaire optionnel.
              Vous ne pouvez voter qu'une seule fois par film.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>1 = Très mauvais</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>5 = Excellent</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Films à voter */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {seanceFilms.map((film) => {
            const filmResults = results?.films?.find((f: any) => f.filmId === film.id);
            const userVote = userVotes[film.id];
            const hasVoted = !!userVote;
            
            return (
              <FilmCard
                key={film.id}
                id={film.id}
                title={film.titre}
                director={film.realisateur}
                duration={film.duree}
                year={film.annee}
                country={film.pays}
                synopsis={film.synopsis}
                rating={filmResults?.moyenneNote || 0}
                voteCount={filmResults?.totalVotes || 0}
                userVote={userVote}
                hasVoted={hasVoted}
                onVote={(note) => handleVote(film.id, note)}
                className="h-full"
                {...(film.posterUrl && { posterUrl: film.posterUrl })}
              />
            );
          })}
        </div>

        {/* Bouton de soumission */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleSubmitVotes}
            loading={voting}
            disabled={Object.keys(votes).length === 0}
            icon={<Send className="h-4 w-4" />}
            size="lg"
          >
            {voting ? 'Envoi en cours...' : `Envoyer ${Object.keys(votes).length} vote${Object.keys(votes).length > 1 ? 's' : ''}`}
          </Button>
        </div>
      </div>
    </div>
  );
}; 
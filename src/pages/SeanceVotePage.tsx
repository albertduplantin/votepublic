import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Star, ArrowLeft, Send, Clock, Users } from 'lucide-react';
import { getSeance, getSeanceResults } from '../services/seanceService';
import { getAllFilms } from '../services/filmService';
import { addVote } from '../services/voteService';
import { Seance, Film, VoteFormData } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ROUTES } from '../utils/constants';

// Schéma de validation pour le vote
const voteSchema = z.object({
  note: z.number().min(1).max(5),
  commentaire: z.string().max(500).optional(),
});

interface VoteData {
  filmId: string;
  note: number;
  commentaire?: string;
}

export const SeanceVotePage: React.FC = () => {
  const { seanceId } = useParams<{ seanceId: string }>();
  const navigate = useNavigate();
  const [seance, setSeance] = useState<Seance | null>(null);
  const [films, setFilms] = useState<Film[]>([]);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [votes, setVotes] = useState<Record<string, VoteData>>({});

  // Charger les données de la séance
  useEffect(() => {
    const loadSeanceData = async () => {
      if (!seanceId) return;
      
      try {
        setLoading(true);
        const [seanceData, filmsData, resultsData] = await Promise.all([
          getSeance(seanceId),
          getAllFilms(),
          getSeanceResults(seanceId),
        ]);
        
        setSeance(seanceData);
        setFilms(filmsData);
        setResults(resultsData);
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
      [filmId]: { filmId, note, commentaire },
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
          commentaire: vote.commentaire,
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
            const currentVote = votes[film.id];
            const filmResults = results?.films?.find((f: any) => f.filmId === film.id);
            
            return (
              <Card key={film.id} className="overflow-hidden">
                {/* Poster */}
                <div className="aspect-[2/3] bg-gray-200 overflow-hidden">
                  {film.posterUrl ? (
                    <img
                      src={film.posterUrl}
                      alt={film.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span>Aucune image</span>
                    </div>
                  )}
                </div>
                
                {/* Informations */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {film.titre}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {film.realisateur}
                  </p>
                  
                  {/* Système de notation */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Votre note :
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleVote(film.id, star, currentVote?.commentaire)}
                          className={`p-1 rounded transition-colors ${
                            currentVote?.note >= star
                              ? 'text-yellow-400 hover:text-yellow-500'
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                    {currentVote?.note && (
                      <p className="text-sm text-gray-600 mt-1">
                        Note : {currentVote.note}/5
                      </p>
                    )}
                  </div>
                  
                  {/* Commentaire */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commentaire (optionnel) :
                    </label>
                    <textarea
                      value={currentVote?.commentaire || ''}
                      onChange={(e) => handleVote(film.id, currentVote?.note || 0, e.target.value)}
                      placeholder="Votre avis sur ce film..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      rows={3}
                      maxLength={500}
                    />
                  </div>
                  
                  {/* Statistiques (si disponibles) */}
                  {filmResults && (
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Moyenne : {filmResults.moyenne}/5</span>
                        <span>{filmResults.totalVotes} vote{filmResults.totalVotes > 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
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
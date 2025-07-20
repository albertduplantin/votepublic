import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Film, VoteFormData } from '../types';
import { getAllFilms } from '../services/filmService';
import { addVoteToQueue, getVoteQueueStatus } from '../services/voteService';
import { useAuth } from '../contexts/AuthContext';
import { generateSessionId, getLocalStorage, setLocalStorage } from '../utils/helpers';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../utils/constants';

// Schéma de validation pour le vote
const voteSchema = z.object({
  note: z.number().min(1).max(5),
  commentaire: z.string().max(500).optional(),
});

export const VotePage: React.FC = () => {
  const { user } = useAuth();
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilm, setSelectedFilm] = useState<Film | null>(null);
  const [queueStatus, setQueueStatus] = useState({ pendingVotes: 0, isProcessing: false, nextBatchIn: 0 });
  const [sessionId] = useState(() => {
    const existing = getLocalStorage('voteSessionId', '');
    if (!existing) {
      const newId = generateSessionId();
      setLocalStorage('voteSessionId', newId);
      return newId;
    }
    return existing;
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<VoteFormData>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      note: 0,
      commentaire: '',
    },
  });

  const watchedNote = watch('note');

  // Charger les films
  useEffect(() => {
    const loadFilms = async () => {
      try {
        const filmsData = await getAllFilms();
        setFilms(filmsData);
      } catch (error) {
        toast.error(ERROR_MESSAGES.NETWORK_ERROR);
      } finally {
        setLoading(false);
      }
    };

    loadFilms();
  }, []);

  // Surveiller le statut de la queue
  useEffect(() => {
    const interval = setInterval(() => {
      const status = getVoteQueueStatus();
      setQueueStatus(status);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Gérer la sélection d'une note
  const handleRatingChange = (rating: number) => {
    setValue('note', rating);
  };

  // Soumettre le vote
  const onSubmit = async (data: VoteFormData) => {
    if (!selectedFilm) {
      toast.error('Veuillez sélectionner un film');
      return;
    }

    try {
      await addVoteToQueue(
        selectedFilm.id,
        data,
        user ? { uid: user.uid, email: user.email } : null,
        sessionId
      );

      toast.success(SUCCESS_MESSAGES.VOTE_PENDING);
      reset();
      setSelectedFilm(null);
    } catch (error: any) {
      toast.error(error.message || ERROR_MESSAGES.VOTE_ERROR);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des films...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-600">Voter pour un film</h1>
              <p className="text-secondary-600 mt-1">
                Donnez votre avis sur les films du festival
              </p>
            </div>
            
            {/* Statut de la queue */}
            <div className="flex items-center space-x-4">
              {queueStatus.pendingVotes > 0 && (
                <div className="flex items-center space-x-2 text-sm text-secondary-600">
                  <Clock className="w-4 h-4" />
                  <span>{queueStatus.pendingVotes} vote(s) en attente</span>
                </div>
              )}
              {queueStatus.isProcessing && (
                <div className="flex items-center space-x-2 text-sm text-primary-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span>Envoi en cours...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {films.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucun film disponible</h2>
            <p className="text-gray-600">Les films seront ajoutés par l'administrateur.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Liste des films */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Films en compétition</h2>
              <div className="space-y-4">
                {films.map((film) => (
                  <div
                    key={film.id}
                    className={`card cursor-pointer transition-all ${
                      selectedFilm?.id === film.id
                        ? 'ring-2 ring-primary-500 bg-primary-50'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedFilm(film)}
                  >
                    <div className="flex space-x-4">
                      {film.posterUrl && (
                        <img
                          src={film.posterUrl}
                          alt={film.titre}
                          className="w-16 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{film.titre}</h3>
                        <p className="text-sm text-gray-600 mb-2">Réalisé par {film.realisateur}</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{film.synopsis}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulaire de vote */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Votre vote</h2>
              
              {selectedFilm ? (
                <div className="card">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedFilm.titre}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Réalisé par {selectedFilm.realisateur}
                    </p>
                    {selectedFilm.posterUrl && (
                      <img
                        src={selectedFilm.posterUrl}
                        alt={selectedFilm.titre}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <p className="text-gray-700">{selectedFilm.synopsis}</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Système de notation */}
                    <div>
                      <label className="form-label">Votre note</label>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className={`star ${
                              star <= watchedNote ? 'star-filled' : 'star-empty'
                            }`}
                          >
                            <Star className="w-8 h-8" fill={star <= watchedNote ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        {watchedNote > 0 ? `${watchedNote}/5 étoiles` : 'Cliquez sur les étoiles pour noter'}
                      </p>
                      {errors.note && (
                        <p className="form-error">{errors.note.message}</p>
                      )}
                    </div>

                    {/* Commentaire */}
                    <div>
                      <label className="form-label">
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Commentaire (optionnel)
                      </label>
                      <textarea
                        {...register('commentaire')}
                        rows={4}
                        className="input-field"
                        placeholder="Partagez votre avis sur ce film..."
                        maxLength={500}
                      />
                      {errors.commentaire && (
                        <p className="form-error">{errors.commentaire.message}</p>
                      )}
                    </div>

                    {/* Bouton de soumission */}
                    <button
                      type="submit"
                      disabled={isSubmitting || watchedNote === 0}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Envoi en cours...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Envoyer mon vote
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sélectionnez un film
                  </h3>
                  <p className="text-gray-600">
                    Cliquez sur un film dans la liste pour commencer à voter
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 
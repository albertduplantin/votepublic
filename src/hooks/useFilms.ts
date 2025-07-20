import { useState, useEffect } from 'react';
import { Film } from '../types';
import { getAllFilms, addFilm, updateFilm, deleteFilm } from '../services/filmService';
import toast from 'react-hot-toast';

export const useFilms = () => {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les films
  const loadFilms = async () => {
    try {
      setLoading(true);
      setError(null);
      const filmsData = await getAllFilms();
      setFilms(filmsData);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erreur lors du chargement des films');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un film
  const createFilm = async (filmData: any) => {
    try {
      const newFilm = await addFilm(filmData);
      setFilms(prev => [...prev, newFilm]);
      toast.success('Film ajouté avec succès');
      return newFilm;
    } catch (err: any) {
      toast.error('Erreur lors de l\'ajout du film');
      throw err;
    }
  };

  // Mettre à jour un film
  const editFilm = async (id: string, updates: any) => {
    try {
      await updateFilm(id, updates);
      setFilms(prev => prev.map(film => film.id === id ? { ...film, ...updates } : film));
      toast.success('Film mis à jour avec succès');
    } catch (err: any) {
      toast.error('Erreur lors de la mise à jour du film');
      throw err;
    }
  };

  // Supprimer un film
  const removeFilm = async (id: string) => {
    try {
      await deleteFilm(id);
      setFilms(prev => prev.filter(film => film.id !== id));
      toast.success('Film supprimé avec succès');
    } catch (err: any) {
      toast.error('Erreur lors de la suppression du film');
      throw err;
    }
  };

  // Rechercher des films
  const searchFilms = (query: string): Film[] => {
    if (!query.trim()) return films;
    
    const lowercaseQuery = query.toLowerCase();
    return films.filter(film => 
      film.titre.toLowerCase().includes(lowercaseQuery) ||
      film.realisateur.toLowerCase().includes(lowercaseQuery) ||
      film.synopsis.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Charger les films au montage
  useEffect(() => {
    loadFilms();
  }, []);

  return {
    films,
    loading,
    error,
    loadFilms,
    createFilm,
    editFilm,
    removeFilm,
    searchFilms,
  };
}; 
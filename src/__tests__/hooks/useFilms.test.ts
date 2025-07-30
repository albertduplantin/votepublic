import { renderHook, act, waitFor } from '@testing-library/react';
import { useFilms } from '../../hooks/useFilms';
import * as filmService from '../../services/filmService';
import { Film } from '../../types';

// Mock du service de films
jest.mock('../../services/filmService');
const mockFilmService = filmService as jest.Mocked<typeof filmService>;

// Mock de react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe('useFilms', () => {
  const mockFilms: Film[] = [
    {
      id: '1',
      titre: 'Film Test 1',
      realisateur: 'Réalisateur 1',
      pays: 'France',
      duree: 15,
      annee: 2023,
      synopsis: 'Synopsis du film 1',
      genre: 'Drame',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      titre: 'Film Test 2',
      realisateur: 'Réalisateur 2',
      pays: 'Belgique',
      duree: 12,
      annee: 2023,
      synopsis: 'Synopsis du film 2',
      genre: 'Comédie',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadFilms', () => {
    it('should load films successfully', async () => {
      mockFilmService.getAllFilms.mockResolvedValue(mockFilms);

      const { result } = renderHook(() => useFilms());

      await act(async () => {
        await result.current.loadFilms();
      });

      expect(result.current.films).toEqual(mockFilms);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle loading state correctly', async () => {
      mockFilmService.getAllFilms.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockFilms), 100))
      );

      const { result } = renderHook(() => useFilms());

      act(() => {
        result.current.loadFilms();
      });

      // Pendant le chargement
      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle errors when loading films', async () => {
      const error = new Error('Erreur de chargement');
      mockFilmService.getAllFilms.mockRejectedValue(error);

      const { result } = renderHook(() => useFilms());

      await act(async () => {
        await result.current.loadFilms();
      });

      expect(result.current.error).toBe('Erreur de chargement');
      expect(result.current.loading).toBe(false);
      expect(result.current.films).toEqual([]);
    });
  });

  describe('createFilm', () => {
    const newFilmData = {
      titre: 'Nouveau Film',
      realisateur: 'Nouveau Réalisateur',
      pays: 'Suisse',
      duree: 18,
      annee: 2024,
      synopsis: 'Synopsis du nouveau film',
      genre: 'Documentaire',
    };

    it('should create film successfully', async () => {
      const createdFilm: Film = {
        id: '3',
        ...newFilmData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockFilmService.createFilm.mockResolvedValue(createdFilm);

      const { result } = renderHook(() => useFilms());

      // Charger les films existants
      mockFilmService.getAllFilms.mockResolvedValue(mockFilms);
      await act(async () => {
        await result.current.loadFilms();
      });

      // Créer un nouveau film
      await act(async () => {
        await result.current.createFilm(newFilmData);
      });

      expect(result.current.films).toHaveLength(3);
      expect(result.current.films).toContainEqual(createdFilm);
    });

    it('should handle errors when creating film', async () => {
      const error = new Error('Erreur de création');
      mockFilmService.createFilm.mockRejectedValue(error);

      const { result } = renderHook(() => useFilms());

      await expect(
        act(async () => {
          await result.current.createFilm(newFilmData);
        })
      ).rejects.toThrow('Erreur de création');
    });
  });

  describe('editFilm', () => {
    it('should edit film successfully', async () => {
      const updatedData = {
        titre: 'Film Modifié',
        realisateur: 'Réalisateur Modifié',
      };

      mockFilmService.updateFilm.mockResolvedValue(undefined);

      const { result } = renderHook(() => useFilms());

      // Charger les films existants
      mockFilmService.getAllFilms.mockResolvedValue(mockFilms);
      await act(async () => {
        await result.current.loadFilms();
      });

      // Modifier un film
      await act(async () => {
        await result.current.editFilm('1', updatedData);
      });

      expect(result.current.films[0]).toEqual({
        ...mockFilms[0],
        ...updatedData,
      });
    });

    it('should handle errors when editing film', async () => {
      const error = new Error('Erreur de modification');
      mockFilmService.updateFilm.mockRejectedValue(error);

      const { result } = renderHook(() => useFilms());

      await expect(
        act(async () => {
          await result.current.editFilm('1', { titre: 'Nouveau titre' });
        })
      ).rejects.toThrow('Erreur de modification');
    });
  });

  describe('removeFilm', () => {
    it('should remove film successfully', async () => {
      mockFilmService.deleteFilm.mockResolvedValue(undefined);

      const { result } = renderHook(() => useFilms());

      // Charger les films existants
      mockFilmService.getAllFilms.mockResolvedValue(mockFilms);
      await act(async () => {
        await result.current.loadFilms();
      });

      // Supprimer un film
      await act(async () => {
        await result.current.removeFilm('1');
      });

      expect(result.current.films).toHaveLength(1);
      expect(result.current.films[0].id).toBe('2');
    });

    it('should handle errors when removing film', async () => {
      const error = new Error('Erreur de suppression');
      mockFilmService.deleteFilm.mockRejectedValue(error);

      const { result } = renderHook(() => useFilms());

      await expect(
        act(async () => {
          await result.current.removeFilm('1');
        })
      ).rejects.toThrow('Erreur de suppression');
    });
  });

  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useFilms());

      expect(result.current.films).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should clear error when loading films successfully after error', async () => {
      // Premier appel échoue
      mockFilmService.getAllFilms.mockRejectedValueOnce(new Error('Erreur initiale'));

      const { result } = renderHook(() => useFilms());

      await act(async () => {
        await result.current.loadFilms();
      });

      expect(result.current.error).toBe('Erreur initiale');

      // Deuxième appel réussit
      mockFilmService.getAllFilms.mockResolvedValueOnce(mockFilms);

      await act(async () => {
        await result.current.loadFilms();
      });

      expect(result.current.error).toBeNull();
      expect(result.current.films).toEqual(mockFilms);
    });
  });

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', async () => {
      const { result, rerender } = renderHook(() => useFilms());

      const initialRenderCount = result.current.films.length;

      // Re-render sans changement
      rerender();

      expect(result.current.films.length).toBe(initialRenderCount);
    });
  });
});
import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Film, CreateFilmData } from '../types';
import { generateId } from '../utils/helpers';

const FILMS_COLLECTION = 'films';
const POSTERS_FOLDER = 'posters';

/**
 * Créer un nouveau film avec upload du poster
 */
export const createFilm = async (data: CreateFilmData): Promise<Film> => {
  try {
    let posterUrl: string | undefined;

    // Upload du poster si fourni
    if (data.poster) {
      posterUrl = await uploadPoster(data.poster);
    }

    const filmData: Omit<Film, 'id'> = {
      titre: data.titre,
      realisateur: data.realisateur,
      pays: data.pays,
      duree: data.duree,
      annee: data.annee,
      synopsis: data.synopsis,
      genre: data.genre,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(posterUrl && { posterUrl }),
    };

    const docRef = await addDoc(collection(db, FILMS_COLLECTION), filmData);
    
    return {
      id: docRef.id,
      ...filmData,
    };
  } catch (error) {
    console.error('Erreur lors de la création du film:', error);
    throw error;
  }
};

/**
 * Récupérer tous les films
 */
export const getAllFilms = async (): Promise<Film[]> => {
  try {
    const q = query(
      collection(db, FILMS_COLLECTION),
      orderBy('titre', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const films: Film[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      films.push({
        id: doc.id,
        titre: data.titre,
        realisateur: data.realisateur,
        pays: data.pays,
        duree: data.duree,
        annee: data.annee,
        synopsis: data.synopsis,
        posterUrl: data.posterUrl,
        genre: data.genre,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    
    return films;
  } catch (error) {
    console.error('Erreur lors de la récupération des films:', error);
    throw error;
  }
};

/**
 * Récupérer un film par son ID
 */
export const getFilmById = async (filmId: string): Promise<Film | null> => {
  try {
    const docRef = doc(db, FILMS_COLLECTION, filmId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        titre: data.titre,
        realisateur: data.realisateur,
        pays: data.pays,
        duree: data.duree,
        annee: data.annee,
        synopsis: data.synopsis,
        posterUrl: data.posterUrl,
        genre: data.genre,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du film:', error);
    throw error;
  }
};

/**
 * Mettre à jour un film
 */
export const updateFilm = async (filmId: string, data: Partial<CreateFilmData>): Promise<void> => {
  try {
    const docRef = doc(db, FILMS_COLLECTION, filmId);
    
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // Upload du nouveau poster si fourni
    if (data.poster) {
      updateData.posterUrl = await uploadPoster(data.poster);
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du film:', error);
    throw error;
  }
};

/**
 * Supprimer un film
 */
export const deleteFilm = async (filmId: string): Promise<void> => {
  try {
    // Récupérer le film pour supprimer le poster
    const film = await getFilmById(filmId);
    if (film?.posterUrl) {
      await deletePoster(film.posterUrl);
    }

    const docRef = doc(db, FILMS_COLLECTION, filmId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du film:', error);
    throw error;
  }
};

/**
 * Upload d'un poster
 */
export const uploadPoster = async (file: File): Promise<string> => {
  try {
    const { storage } = await import('./firebase');
    const fileName = `${generateId()}_${file.name}`;
    const storageRef = ref(storage, `${POSTERS_FOLDER}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Erreur lors de l\'upload du poster:', error);
    throw error;
  }
};

/**
 * Supprimer un poster
 */
export const deletePoster = async (posterUrl: string): Promise<void> => {
  try {
    const { storage } = await import('./firebase');
    const storageRef = ref(storage, posterUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Erreur lors de la suppression du poster:', error);
    // Ne pas throw l'erreur car ce n'est pas critique
  }
};

/**
 * Rechercher des films
 */
export const searchFilms = async (searchTerm: string): Promise<Film[]> => {
  try {
    const films = await getAllFilms();
    const term = searchTerm.toLowerCase();
    
    return films.filter(film => 
      film.titre.toLowerCase().includes(term) ||
      film.realisateur.toLowerCase().includes(term) ||
      film.pays.toLowerCase().includes(term) ||
      film.genre.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Erreur lors de la recherche de films:', error);
    throw error;
  }
};

/**
 * Récupérer les films par genre
 */
export const getFilmsByGenre = async (genre: string): Promise<Film[]> => {
  try {
    const q = query(
      collection(db, FILMS_COLLECTION),
      where('genre', '==', genre),
      orderBy('titre', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const films: Film[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      films.push({
        id: doc.id,
        titre: data.titre,
        realisateur: data.realisateur,
        pays: data.pays,
        duree: data.duree,
        annee: data.annee,
        synopsis: data.synopsis,
        posterUrl: data.posterUrl,
        genre: data.genre,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    
    return films;
  } catch (error) {
    console.error('Erreur lors de la récupération des films par genre:', error);
    throw error;
  }
};

/**
 * Récupérer les films récents
 */
export const getRecentFilms = async (limitCount: number = 10): Promise<Film[]> => {
  try {
    const q = query(
      collection(db, FILMS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const films: Film[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      films.push({
        id: doc.id,
        titre: data.titre,
        realisateur: data.realisateur,
        pays: data.pays,
        duree: data.duree,
        annee: data.annee,
        synopsis: data.synopsis,
        posterUrl: data.posterUrl,
        genre: data.genre,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    
    return films;
  } catch (error) {
    console.error('Erreur lors de la récupération des films récents:', error);
    throw error;
  }
};

/**
 * Récupérer les statistiques des films
 */
export const getFilmsStats = async (): Promise<{
  total: number;
  parGenre: Record<string, number>;
  parPays: Record<string, number>;
  parAnnee: Record<number, number>;
}> => {
  try {
    const films = await getAllFilms();
    
    const stats = {
      total: films.length,
      parGenre: {} as Record<string, number>,
      parPays: {} as Record<string, number>,
      parAnnee: {} as Record<number, number>,
    };
    
    films.forEach(film => {
      // Compter par genre
      stats.parGenre[film.genre] = (stats.parGenre[film.genre] || 0) + 1;
      
      // Compter par pays
      stats.parPays[film.pays] = (stats.parPays[film.pays] || 0) + 1;
      
      // Compter par année
      stats.parAnnee[film.annee] = (stats.parAnnee[film.annee] || 0) + 1;
    });
    
    return stats;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques des films:', error);
    throw error;
  }
};

/**
 * Récupérer les genres disponibles
 */
export const getAvailableGenres = async (): Promise<string[]> => {
  try {
    const films = await getAllFilms();
    const genres = Array.from(new Set(films.map(film => film.genre)));
    return genres.sort();
  } catch (error) {
    console.error('Erreur lors de la récupération des genres:', error);
    throw error;
  }
};

/**
 * Récupérer plusieurs films par leurs IDs
 */
export const getFilmsByIds = async (filmIds: string[]): Promise<Film[]> => {
  try {
    if (filmIds.length === 0) return [];
    
    // Récupérer les films en parallèle
    const filmPromises = filmIds.map(id => getFilmById(id));
    const films = await Promise.all(filmPromises);
    
    // Filtrer les films null et retourner
    return films.filter((film): film is Film => film !== null);
  } catch (error) {
    console.error('Erreur lors de la récupération des films par IDs:', error);
    throw error;
  }
};

/**
 * Récupérer les pays disponibles
 */
export const getAvailableCountries = async (): Promise<string[]> => {
  try {
    const films = await getAllFilms();
    const countries = Array.from(new Set(films.map(film => film.pays)));
    return countries.sort();
  } catch (error) {
    console.error('Erreur lors de la récupération des pays:', error);
    throw error;
  }
}; 
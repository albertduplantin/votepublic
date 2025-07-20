import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Film, FilmFormData } from '../types';
import { COLLECTIONS } from '../utils/constants';
import { generateId, resizeImage } from '../utils/helpers';

/**
 * Ajouter un nouveau film
 */
export const addFilm = async (data: FilmFormData): Promise<Film> => {
  try {
    let posterUrl = '';

    // Upload et redimensionner l'affiche si fournie
    if (data.poster) {
      const resizedImage = await resizeImage(data.poster, 800, 600);
      const posterRef = ref(storage, `posters/${generateId()}.jpg`);
      await uploadBytes(posterRef, resizedImage);
      posterUrl = await getDownloadURL(posterRef);
    }

    const filmData: Omit<Film, 'id'> = {
      titre: data.titre.trim(),
      realisateur: data.realisateur.trim(),
      synopsis: data.synopsis.trim(),
      posterUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.FILMS), filmData);

    return {
      id: docRef.id,
      ...filmData,
    };
  } catch (error: any) {
    throw new Error('Erreur lors de l\'ajout du film');
  }
};

/**
 * Mettre à jour un film
 */
export const updateFilm = async (
  id: string,
  data: Partial<FilmFormData>
): Promise<void> => {
  try {
    const filmRef = doc(db, COLLECTIONS.FILMS, id);
    const filmDoc = await getDoc(filmRef);

    if (!filmDoc.exists()) {
      throw new Error('Film non trouvé');
    }

    const updateData: Partial<Film> = {
      ...data,
      updatedAt: new Date(),
    };

    // Gérer l'upload de la nouvelle affiche
    if (data.poster) {
      const resizedImage = await resizeImage(data.poster, 800, 600);
      const posterRef = ref(storage, `posters/${generateId()}.jpg`);
      await uploadBytes(posterRef, resizedImage);
      updateData.posterUrl = await getDownloadURL(posterRef);

      // Supprimer l'ancienne affiche
      const currentFilm = filmDoc.data() as Film;
      if (currentFilm.posterUrl) {
        try {
          const oldPosterRef = ref(storage, currentFilm.posterUrl);
          await deleteObject(oldPosterRef);
        } catch (error) {
          console.warn('Impossible de supprimer l\'ancienne affiche:', error);
        }
      }
    }

    // Supprimer les champs non-Firestore
    delete (updateData as any).poster;

    await updateDoc(filmRef, updateData);
  } catch (error: any) {
    throw new Error('Erreur lors de la mise à jour du film');
  }
};

/**
 * Supprimer un film
 */
export const deleteFilm = async (id: string): Promise<void> => {
  try {
    const filmRef = doc(db, COLLECTIONS.FILMS, id);
    const filmDoc = await getDoc(filmRef);

    if (!filmDoc.exists()) {
      throw new Error('Film non trouvé');
    }

    // Supprimer l'affiche
    const film = filmDoc.data() as Film;
    if (film.posterUrl) {
      try {
        const posterRef = ref(storage, film.posterUrl);
        await deleteObject(posterRef);
      } catch (error) {
        console.warn('Impossible de supprimer l\'affiche:', error);
      }
    }

    await deleteDoc(filmRef);
  } catch (error: any) {
    throw new Error('Erreur lors de la suppression du film');
  }
};

/**
 * Récupérer un film par ID
 */
export const getFilm = async (id: string): Promise<Film> => {
  try {
    const filmDoc = await getDoc(doc(db, COLLECTIONS.FILMS, id));

    if (!filmDoc.exists()) {
      throw new Error('Film non trouvé');
    }

    const filmData = filmDoc.data();
    return {
      id: filmDoc.id,
      ...filmData,
      createdAt: filmData.createdAt?.toDate() || new Date(),
      updatedAt: filmData.updatedAt?.toDate() || new Date(),
    } as Film;
  } catch (error: any) {
    throw new Error('Erreur lors de la récupération du film');
  }
};

/**
 * Récupérer tous les films
 */
export const getAllFilms = async (): Promise<Film[]> => {
  try {
    const filmsQuery = query(
      collection(db, COLLECTIONS.FILMS),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(filmsQuery);
    const films: Film[] = [];

    querySnapshot.forEach((doc) => {
      const filmData = doc.data();
      films.push({
        id: doc.id,
        ...filmData,
        createdAt: filmData.createdAt?.toDate() || new Date(),
        updatedAt: filmData.updatedAt?.toDate() || new Date(),
      } as Film);
    });

    return films;
  } catch (error: any) {
    throw new Error('Erreur lors de la récupération des films');
  }
};

/**
 * Écouter les changements de la collection films
 */
export const onFilmsChange = (callback: (films: Film[]) => void) => {
  const filmsQuery = query(
    collection(db, COLLECTIONS.FILMS),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(filmsQuery, (querySnapshot) => {
    const films: Film[] = [];

    querySnapshot.forEach((doc) => {
      const filmData = doc.data();
      films.push({
        id: doc.id,
        ...filmData,
        createdAt: filmData.createdAt?.toDate() || new Date(),
        updatedAt: filmData.updatedAt?.toDate() || new Date(),
      } as Film);
    });

    callback(films);
  });
};

/**
 * Rechercher des films par titre ou réalisateur
 */
export const searchFilms = async (searchTerm: string): Promise<Film[]> => {
  try {
    const searchLower = searchTerm.toLowerCase();
    const allFilms = await getAllFilms();

    return allFilms.filter(
      (film) =>
        film.titre.toLowerCase().includes(searchLower) ||
        film.realisateur.toLowerCase().includes(searchLower)
    );
  } catch (error: any) {
    throw new Error('Erreur lors de la recherche de films');
  }
}; 
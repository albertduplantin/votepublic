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
  orderBy
} from 'firebase/firestore';

import { Seance, CreateSeanceData, Film } from '../types';
import { generateId } from '../utils/helpers';

const SEANCES_COLLECTION = 'seances';
const FILMS_COLLECTION = 'films';

/**
 * Créer une nouvelle séance avec génération automatique du QR code
 */
export const createSeance = async (data: CreateSeanceData): Promise<Seance> => {
  try {
    // Vérifier qu'il y a au moins 1 film et au plus 5
    if (data.films.length < 1 || data.films.length > 5) {
      throw new Error('Une séance doit contenir entre 1 et 5 films');
    }

    // Vérifier que tous les films existent
    const filmsPromises = data.films.map(filmId => 
      getDoc(doc(db, FILMS_COLLECTION, filmId))
    );
    const filmsSnapshots = await Promise.all(filmsPromises);
    
    const nonExistentFilms = filmsSnapshots
      .map((snapshot, index) => ({ snapshot, filmId: data.films[index] }))
      .filter(({ snapshot }) => !snapshot.exists());
    
    if (nonExistentFilms.length > 0) {
      throw new Error(`Films non trouvés: ${nonExistentFilms.map(f => f.filmId).join(', ')}`);
    }

    // Générer l'URL du QR code
    const seanceId = generateId();
    const qrCodeUrl = generateQRCodeUrl(seanceId);

    const seanceData: Omit<Seance, 'id'> = {
      nom: data.nom,
      date: data.date,
      heure: data.heure,
      films: data.films,
      qrCodeUrl,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(data.description && { description: data.description }),
    };

    const docRef = await addDoc(collection(db, SEANCES_COLLECTION), seanceData);
    
    return {
      id: docRef.id,
      ...seanceData,
    };
  } catch (error) {
    console.error('Erreur lors de la création de la séance:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les séances
 */
export const getAllSeances = async (): Promise<Seance[]> => {
  try {
    const q = query(
      collection(db, SEANCES_COLLECTION),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const seances: Seance[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      seances.push({
        id: doc.id,
        nom: data.nom,
        description: data.description,
        date: data.date.toDate(),
        heure: data.heure,
        films: data.films,
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    
    return seances;
  } catch (error) {
    console.error('Erreur lors de la récupération des séances:', error);
    throw error;
  }
};

/**
 * Récupérer une séance par son ID
 */
export const getSeanceById = async (seanceId: string): Promise<Seance | null> => {
  try {
    const docRef = doc(db, SEANCES_COLLECTION, seanceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        nom: data.nom,
        description: data.description,
        date: data.date.toDate(),
        heure: data.heure,
        films: data.films,
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de la séance:', error);
    throw error;
  }
};

/**
 * Récupérer une séance avec ses films
 */
export const getSeanceWithFilms = async (seanceId: string): Promise<{ seance: Seance; films: Film[] } | null> => {
  try {
    const seance = await getSeanceById(seanceId);
    if (!seance) return null;

    // Récupérer tous les films de la séance
    const filmsPromises = seance.films.map(filmId => 
      getDoc(doc(db, FILMS_COLLECTION, filmId))
    );
    const filmsSnapshots = await Promise.all(filmsPromises);
    
    const films: Film[] = [];
    
    for (const snapshot of filmsSnapshots) {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data) {
          films.push({
            id: snapshot.id,
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
        }
      }
    }

    return { seance, films };
  } catch (error) {
    console.error('Erreur lors de la récupération de la séance avec films:', error);
    throw error;
  }
};

/**
 * Mettre à jour une séance
 */
export const updateSeance = async (seanceId: string, data: Partial<CreateSeanceData>): Promise<void> => {
  try {
    console.log('Mise à jour de la séance:', seanceId, data);
    
    const docRef = doc(db, SEANCES_COLLECTION, seanceId);
    
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Ajouter les champs modifiés
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.heure !== undefined) updateData.heure = data.heure;
    if (data.films !== undefined) updateData.films = data.films;

    // Traiter la date séparément car elle doit être un Timestamp Firestore
    if (data.date !== undefined) {
      updateData.date = data.date;
    }

    // Si les films changent, vérifier qu'il y en a au moins 1 et au plus 5
    if (data.films && (data.films.length < 1 || data.films.length > 5)) {
      throw new Error('Une séance doit contenir entre 1 et 5 films');
    }

    console.log('Données de mise à jour:', updateData);
    await updateDoc(docRef, updateData);
    console.log('Séance mise à jour avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la séance:', error);
    throw error;
  }
};

/**
 * Supprimer une séance
 */
export const deleteSeance = async (seanceId: string): Promise<void> => {
  try {
    const docRef = doc(db, SEANCES_COLLECTION, seanceId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression de la séance:', error);
    throw error;
  }
};

/**
 * Activer/désactiver une séance
 */
export const toggleSeanceActive = async (seanceId: string, isActive: boolean): Promise<void> => {
  try {
    const docRef = doc(db, SEANCES_COLLECTION, seanceId);
    await updateDoc(docRef, {
      isActive,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Erreur lors de la modification du statut de la séance:', error);
    throw error;
  }
};

/**
 * Récupérer les séances actives
 */
export const getActiveSeances = async (): Promise<Seance[]> => {
  try {
    const q = query(
      collection(db, SEANCES_COLLECTION),
      where('isActive', '==', true),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const seances: Seance[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      seances.push({
        id: doc.id,
        nom: data.nom,
        description: data.description,
        date: data.date.toDate(),
        heure: data.heure,
        films: data.films,
        qrCodeUrl: data.qrCodeUrl,
        isActive: data.isActive,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    
    return seances;
  } catch (error) {
    console.error('Erreur lors de la récupération des séances actives:', error);
    throw error;
  }
};

/**
 * Générer l'URL du QR code pour une séance
 */
export const generateQRCodeUrl = (seanceId: string): string => {
  const baseUrl = window.location.origin;
  const seanceUrl = `${baseUrl}/seance/${seanceId}`;
  
  // Utiliser un service de génération de QR code
  const qrServiceUrl = 'https://api.qrserver.com/v1/create-qr-code/';
  const params = new URLSearchParams({
    size: '300x300',
    data: seanceUrl,
    format: 'png',
  });
  
  return `${qrServiceUrl}?${params.toString()}`;
};

/**
 * Récupérer les statistiques des séances
 */
export const getSeancesStats = async (): Promise<{
  total: number;
  actives: number;
  inactives: number;
  cetteSemaine: number;
}> => {
  try {
    const seances = await getAllSeances();
    const maintenant = new Date();
    const uneSemaine = new Date(maintenant.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: seances.length,
      actives: seances.filter(s => s.isActive).length,
      inactives: seances.filter(s => !s.isActive).length,
      cetteSemaine: seances.filter(s => s.date >= maintenant && s.date <= uneSemaine).length,
    };
    
    return stats;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw error;
  }
};

/**
 * Rechercher des séances par nom
 */
export const searchSeances = async (searchTerm: string): Promise<Seance[]> => {
  try {
    const seances = await getAllSeances();
    const term = searchTerm.toLowerCase();
    
    return seances.filter(seance => 
      seance.nom.toLowerCase().includes(term) ||
      (seance.description && seance.description.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error('Erreur lors de la recherche de séances:', error);
    throw error;
  }
}; 
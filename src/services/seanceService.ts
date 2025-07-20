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
  where,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Seance, SeanceFormData, SeanceResults } from '../types';
import { COLLECTIONS } from '../utils/constants';
import { generateId } from '../utils/helpers';

/**
 * Générer un QR code pour une séance
 */
export const generateQRCode = (seanceId: string): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  const seanceUrl = `${baseUrl}seance/${seanceId}`;
  
  // Utiliser l'API QR Server pour générer le QR code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(seanceUrl)}`;
  
  return qrCodeUrl;
};

/**
 * Ajouter une nouvelle séance
 */
export const addSeance = async (data: SeanceFormData): Promise<Seance> => {
  try {
    const seanceData: Omit<Seance, 'id' | 'qrCodeUrl' | 'createdAt' | 'updatedAt'> = {
      nom: data.nom.trim(),
      description: data.description?.trim(),
      date: new Date(data.date),
      heure: data.heure,
      films: data.films,
    };

    const docRef = await addDoc(collection(db, COLLECTIONS.SEANCES), seanceData);
    const seanceId = docRef.id;
    
    // Générer le QR code
    const qrCodeUrl = generateQRCode(seanceId);
    
    // Mettre à jour avec le QR code
    await updateDoc(docRef, {
      qrCodeUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      id: seanceId,
      ...seanceData,
      qrCodeUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error: any) {
    throw new Error('Erreur lors de l\'ajout de la séance');
  }
};

/**
 * Mettre à jour une séance
 */
export const updateSeance = async (
  id: string,
  data: Partial<SeanceFormData>
): Promise<void> => {
  try {
    const seanceRef = doc(db, COLLECTIONS.SEANCES, id);
    const seanceDoc = await getDoc(seanceRef);

    if (!seanceDoc.exists()) {
      throw new Error('Séance non trouvée');
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    // Ajouter les champs mis à jour
    if (data.nom) updateData.nom = data.nom.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim();
    if (data.date) updateData.date = new Date(data.date);
    if (data.heure) updateData.heure = data.heure;
    if (data.films) {
      updateData.films = data.films;
      updateData.qrCodeUrl = generateQRCode(id);
    }

    await updateDoc(seanceRef, updateData);
  } catch (error: any) {
    throw new Error('Erreur lors de la mise à jour de la séance');
  }
};

/**
 * Supprimer une séance
 */
export const deleteSeance = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.SEANCES, id));
  } catch (error: any) {
    throw new Error('Erreur lors de la suppression de la séance');
  }
};

/**
 * Récupérer une séance par ID
 */
export const getSeance = async (id: string): Promise<Seance> => {
  try {
    const seanceDoc = await getDoc(doc(db, COLLECTIONS.SEANCES, id));

    if (!seanceDoc.exists()) {
      throw new Error('Séance non trouvée');
    }

    const seanceData = seanceDoc.data();
    return {
      id: seanceDoc.id,
      ...seanceData,
      date: seanceData.date?.toDate() || new Date(),
      createdAt: seanceData.createdAt?.toDate() || new Date(),
      updatedAt: seanceData.updatedAt?.toDate() || new Date(),
    } as Seance;
  } catch (error: any) {
    throw new Error('Erreur lors de la récupération de la séance');
  }
};

/**
 * Récupérer toutes les séances
 */
export const getAllSeances = async (): Promise<Seance[]> => {
  try {
    const seancesQuery = query(
      collection(db, COLLECTIONS.SEANCES),
      orderBy('date', 'asc')
    );

    const querySnapshot = await getDocs(seancesQuery);
    const seances: Seance[] = [];

    querySnapshot.forEach((doc) => {
      const seanceData = doc.data();
      seances.push({
        id: doc.id,
        ...seanceData,
        date: seanceData.date?.toDate() || new Date(),
        createdAt: seanceData.createdAt?.toDate() || new Date(),
        updatedAt: seanceData.updatedAt?.toDate() || new Date(),
      } as Seance);
    });

    return seances;
  } catch (error: any) {
    throw new Error('Erreur lors de la récupération des séances');
  }
};

/**
 * Écouter les changements de la collection séances
 */
export const onSeancesChange = (callback: (seances: Seance[]) => void) => {
  const seancesQuery = query(
    collection(db, COLLECTIONS.SEANCES),
    orderBy('date', 'asc')
  );

  return onSnapshot(seancesQuery, (querySnapshot) => {
    const seances: Seance[] = [];

    querySnapshot.forEach((doc) => {
      const seanceData = doc.data();
      seances.push({
        id: doc.id,
        ...seanceData,
        date: seanceData.date?.toDate() || new Date(),
        createdAt: seanceData.createdAt?.toDate() || new Date(),
        updatedAt: seanceData.updatedAt?.toDate() || new Date(),
      } as Seance);
    });

    callback(seances);
  });
};

/**
 * Récupérer les résultats d'une séance
 */
export const getSeanceResults = async (seanceId: string): Promise<SeanceResults> => {
  try {
    const seance = await getSeance(seanceId);
    
    // Récupérer les votes pour cette séance
    const votesQuery = query(
      collection(db, COLLECTIONS.VOTES),
      where('seanceId', '==', seanceId)
    );
    
    const votesSnapshot = await getDocs(votesQuery);
    const votes = votesSnapshot.docs.map(doc => doc.data());
    
    // Calculer les statistiques par film
    const filmStats = new Map();
    
    votes.forEach(vote => {
      if (!filmStats.has(vote.filmId)) {
        filmStats.set(vote.filmId, {
          votes: [],
          commentaires: [],
        });
      }
      
      filmStats.get(vote.filmId).votes.push(vote.note);
      if (vote.commentaire) {
        filmStats.get(vote.filmId).commentaires.push(vote.commentaire);
      }
    });
    
    // Formater les résultats
    const films = await Promise.all(
      seance.films.map(async (filmId) => {
        const filmDoc = await getDoc(doc(db, COLLECTIONS.FILMS, filmId));
        const filmData = filmDoc.data();
        
        const stats = filmStats.get(filmId) || { votes: [], commentaires: [] };
        const ratings = stats.votes;
        
        // Calculer la moyenne
        const moyenne = ratings.length > 0 
          ? ratings.reduce((sum: number, rating: number) => sum + rating, 0) / ratings.length 
          : 0;
        
        // Calculer la distribution
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratings.forEach((rating: number) => {
          if (rating >= 1 && rating <= 5) {
            distribution[rating]++;
          }
        });
        
        return {
          filmId,
          titre: filmData?.titre || 'Film inconnu',
          realisateur: filmData?.realisateur || 'Réalisateur inconnu',
          posterUrl: filmData?.posterUrl || '',
          moyenne: Math.round(moyenne * 10) / 10,
          totalVotes: ratings.length,
          distribution,
          commentaires: stats.commentaires,
        };
      })
    );
    
    return {
      seanceId,
      seanceNom: seance.nom,
      films,
      totalVotes: votes.length,
      dateSeance: seance.date,
    };
  } catch (error: any) {
    throw new Error('Erreur lors de la récupération des résultats');
  }
}; 
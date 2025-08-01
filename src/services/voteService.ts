import {
  collection,
  doc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Vote, VoteFormData } from '../types';
import { COLLECTIONS } from '../utils/constants';
import { generateId, generateSessionId, getUserAgent, getIpAddress } from '../utils/helpers';

// Queue pour les votes en batch
let voteQueue: Vote[] = [];
let batchTimeout: number | null = null;
let isProcessingBatch = false;

/**
 * Ajouter un vote directement (pour les séances)
 */
export const addVote = async (data: {
  filmId: string;
  seanceId?: string;
  note: number;
  commentaire?: string;
  userId?: string;
}): Promise<void> => {
  try {
    const ipAddress = await getIpAddress();
    const vote: Vote = {
      id: generateId(),
      filmId: data.filmId,
      seanceId: data.seanceId || '',
      note: data.note,
      userAgent: getUserAgent(),
      sessionId: generateSessionId(),
      createdAt: new Date(),
      ...(data.commentaire?.trim() && { commentaire: data.commentaire.trim() }),
      ...(ipAddress && { ipAddress }),
      ...(data.userId && { userId: data.userId }),
    };

    // Ajouter directement à Firestore
    const voteRef = doc(collection(db, COLLECTIONS.VOTES));
    await setDoc(voteRef, {
      ...vote,
      id: voteRef.id,
    } as any);
  } catch (error: any) {
    throw new Error('Erreur lors de l\'ajout du vote');
  }
};

/**
 * Ajouter un vote à la queue
 */
export const addVoteToQueue = async (
  filmId: string,
  data: VoteFormData,
  user?: { uid: string; email: string } | null,
  sessionId?: string
): Promise<void> => {
  try {
    const ipAddress = await getIpAddress();
    const vote: Vote = {
      id: generateId(),
      filmId,
      seanceId: '',
      note: data.note,
      userAgent: getUserAgent(),
      sessionId: sessionId || generateSessionId(),
      createdAt: new Date(),
      ...(data.commentaire?.trim() && { commentaire: data.commentaire.trim() }),
      ...(ipAddress && { ipAddress }),
      ...(user?.uid && { userId: user.uid }),
    };

    voteQueue.push(vote);

    // Démarrer le timer pour l'envoi en batch
    if (!batchTimeout) {
      batchTimeout = window.setTimeout(() => {
        processVoteBatch();
      }, 5000); // 5 secondes de délai
    }

    // Vérifier si l'utilisateur a déjà voté pour ce film
    const hasVoted = await checkIfUserVoted(filmId, user?.uid, sessionId);
    if (hasVoted) {
      throw new Error('Vous avez déjà voté pour ce film');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Erreur lors de l\'ajout du vote');
  }
};

/**
 * Traiter la queue de votes en batch
 */
const processVoteBatch = async (): Promise<void> => {
  if (isProcessingBatch || voteQueue.length === 0) {
    return;
  }

  isProcessingBatch = true;
  const votesToProcess = [...voteQueue];
  voteQueue = [];
  batchTimeout = null;

  try {
    const batch = writeBatch(db);

    // Ajouter tous les votes au batch
    votesToProcess.forEach((vote) => {
      const voteRef = doc(collection(db, COLLECTIONS.VOTES));
      batch.set(voteRef, {
        ...vote,
        id: voteRef.id,
      });
    });

    // Exécuter le batch
    await batch.commit();

    console.log(`${votesToProcess.length} votes envoyés avec succès`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi du batch:', error);
    
    // Remettre les votes dans la queue pour retry
    voteQueue.unshift(...votesToProcess);
    
    // Retry après 10 secondes
    setTimeout(() => {
      isProcessingBatch = false;
      if (voteQueue.length > 0) {
        processVoteBatch();
      }
    }, 10000);
  } finally {
    isProcessingBatch = false;
  }
};

/**
 * Vérifier si un utilisateur a déjà voté pour un film
 */
export const checkIfUserVoted = async (
  filmId: string,
  userId?: string,
  sessionId?: string
): Promise<boolean> => {
  try {
    let voteQuery;

    if (userId) {
      // Utilisateur connecté - vérifier par userId
      voteQuery = query(
        collection(db, COLLECTIONS.VOTES),
        where('filmId', '==', filmId),
        where('userId', '==', userId)
      );
    } else if (sessionId) {
      // Vote anonyme - vérifier par sessionId
      voteQuery = query(
        collection(db, COLLECTIONS.VOTES),
        where('filmId', '==', filmId),
        where('sessionId', '==', sessionId)
      );
    } else {
      // Pas d'identifiant - vérifier par IP et UserAgent
      const ipAddress = await getIpAddress();
      const userAgent = getUserAgent();
      
      voteQuery = query(
        collection(db, COLLECTIONS.VOTES),
        where('filmId', '==', filmId),
        where('ipAddress', '==', ipAddress),
        where('userAgent', '==', userAgent)
      );
    }

    const querySnapshot = await getDocs(voteQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Erreur lors de la vérification du vote:', error);
    return false;
  }
};

/**
 * Récupérer le vote d'un utilisateur pour un film
 */
export const getUserVoteForFilm = async (
  filmId: string,
  userId?: string,
  sessionId?: string
): Promise<Vote | null> => {
  try {
    let voteQuery;

    if (userId) {
      // Utilisateur connecté
      voteQuery = query(
        collection(db, COLLECTIONS.VOTES),
        where('filmId', '==', filmId),
        where('userId', '==', userId)
      );
    } else if (sessionId) {
      // Vote anonyme
      voteQuery = query(
        collection(db, COLLECTIONS.VOTES),
        where('filmId', '==', filmId),
        where('sessionId', '==', sessionId)
      );
    } else {
      // Pas d'identifiant - vérifier par IP et UserAgent
      const ipAddress = await getIpAddress();
      const userAgent = getUserAgent();
      
      voteQuery = query(
        collection(db, COLLECTIONS.VOTES),
        where('filmId', '==', filmId),
        where('ipAddress', '==', ipAddress),
        where('userAgent', '==', userAgent)
      );
    }

    const querySnapshot = await getDocs(voteQuery);
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const voteData = doc.data();
      return {
        ...voteData,
        id: doc.id,
        createdAt: voteData.createdAt?.toDate() || new Date(),
      } as Vote;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du vote utilisateur:', error);
    return null;
  }
};

/**
 * Récupérer les votes d'un film
 */
export const getFilmVotes = async (filmId: string): Promise<Vote[]> => {
  try {
    const votesQuery = query(
      collection(db, COLLECTIONS.VOTES),
      where('filmId', '==', filmId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(votesQuery);
    const votes: Vote[] = [];

    querySnapshot.forEach((doc) => {
      const voteData = doc.data();
      votes.push({
        ...voteData,
        id: doc.id,
        createdAt: voteData.createdAt?.toDate() || new Date(),
      } as Vote);
    });

    return votes;
  } catch (error: any) {
    throw new Error('Erreur lors de la récupération des votes');
  }
};

/**
 * Supprimer un vote
 */
export const deleteVote = async (voteId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.VOTES, voteId));
  } catch (error: any) {
    throw new Error('Erreur lors de la suppression du vote');
  }
};

/**
 * Récupérer les statistiques d'un film
 */
export const getFilmStats = async (filmId: string): Promise<{
  filmId: string;
  titre: string;
  totalVotes: number;
  moyenneNote: number;
  distributionNotes: Record<number, number>;
  commentaires: string[];
}> => {
  try {
    const votes = await getFilmVotes(filmId);
    const ratings = votes.map(vote => vote.note);
    
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });

    const moyenne = ratings.length > 0 
      ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
      : 0;

    const commentaires = votes
      .filter(vote => vote.commentaire)
      .map(vote => vote.commentaire!)
      .slice(0, 10); // Limiter à 10 commentaires

    return {
      filmId,
      titre: '', // Sera rempli par l'appelant
      totalVotes: votes.length,
      moyenneNote: moyenne,
      distributionNotes: distribution,
      commentaires,
    };
  } catch (error: any) {
    throw new Error('Erreur lors du calcul des statistiques');
  }
};

/**
 * Écouter les changements de votes pour un film
 */
export const onVotesChange = (filmId: string, callback: (votes: Vote[]) => void) => {
  const votesQuery = query(
    collection(db, COLLECTIONS.VOTES),
    where('filmId', '==', filmId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(votesQuery, (querySnapshot) => {
    const votes: Vote[] = [];

    querySnapshot.forEach((doc) => {
      const voteData = doc.data();
      votes.push({
        ...voteData,
        id: doc.id,
        createdAt: voteData.createdAt?.toDate() || new Date(),
      } as Vote);
    });

    callback(votes);
  });
};

/**
 * Récupérer le statut de la queue de votes
 */
export const getVoteQueueStatus = () => {
  return {
    pendingVotes: voteQueue.length,
    isProcessing: isProcessingBatch,
    nextBatchIn: batchTimeout ? 5000 : 0,
  };
};

/**
 * Forcer l'envoi immédiat de la queue
 */
export const forceProcessBatch = async (): Promise<void> => {
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
  await processVoteBatch();
};

/**
 * Récupérer tous les votes (pour les résultats globaux)
 */
export const getAllVotes = async (): Promise<Vote[]> => {
  try {
    const votesQuery = query(
      collection(db, COLLECTIONS.VOTES),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(votesQuery);
    const votes: Vote[] = [];

    querySnapshot.forEach((doc) => {
      const voteData = doc.data();
      votes.push({
        ...voteData,
        id: doc.id,
        createdAt: voteData.createdAt?.toDate() || new Date(),
      } as Vote);
    });

    return votes;
  } catch (error: any) {
    console.error('Erreur lors de la récupération de tous les votes:', error);
    throw new Error('Erreur lors de la récupération des votes');
  }
};

/**
 * Récupérer les résultats d'une séance
 */
export const getSeanceResults = async (seanceId: string): Promise<{
  seanceId: string;
  totalVotes: number;
  films: Array<{
    filmId: string;
    titre: string;
    totalVotes: number;
    moyenneNote: number;
    distributionNotes: Record<number, number>;
  }>;
}> => {
  try {
    console.log(`Recherche des votes pour la séance: ${seanceId}`);
    
    // Récupérer tous les votes (sans filtre par séance pour l'instant)
    const votesQuery = query(
      collection(db, COLLECTIONS.VOTES),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(votesQuery);
    const votes: Vote[] = [];

    querySnapshot.forEach((doc) => {
      const voteData = doc.data();
      votes.push({
        ...voteData,
        id: doc.id,
        createdAt: voteData.createdAt?.toDate() || new Date(),
      } as Vote);
    });

    console.log(`Total des votes trouvés: ${votes.length}`);
    console.log('Votes:', votes.map(v => ({ filmId: v.filmId, seanceId: v.seanceId, note: v.note })));

    // Grouper les votes par film (pour cette séance)
    const filmVotes: Record<string, Vote[]> = {};
    votes.forEach(vote => {
      // Inclure tous les votes pour les films de cette séance, même sans seanceId
      if (!filmVotes[vote.filmId]) {
        filmVotes[vote.filmId] = [];
      }
      filmVotes[vote.filmId].push(vote);
    });

    console.log(`Films avec votes: ${Object.keys(filmVotes).length}`);

    // Calculer les statistiques pour chaque film
    const films = Object.entries(filmVotes).map(([filmId, filmVotes]) => {
      const ratings = filmVotes.map(vote => vote.note);
      const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      
      ratings.forEach(rating => {
        if (rating >= 1 && rating <= 5) {
          distribution[rating]++;
        }
      });

      const moyenne = ratings.length > 0 
        ? Math.round((ratings.reduce((sum, r) => sum + r, 0) / ratings.length) * 10) / 10
        : 0;

      return {
        filmId,
        titre: '', // Sera rempli par l'appelant
        totalVotes: filmVotes.length,
        moyenneNote: moyenne,
        distributionNotes: distribution,
      };
    });

    const totalVotes = votes.length;
    console.log(`Résultats pour séance ${seanceId}: ${totalVotes} votes, ${films.length} films`);

    return {
      seanceId,
      totalVotes,
      films,
    };
  } catch (error: any) {
    console.error('Erreur détaillée dans getSeanceResults:', error);
    throw new Error('Erreur lors de la récupération des résultats de la séance');
  }
}; 
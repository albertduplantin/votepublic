// Types pour les films
export interface Film {
  id: string;
  titre: string;
  realisateur: string;
  synopsis: string;
  posterUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les votes
export interface Vote {
  id: string;
  filmId: string;
  note: number; // 1-5 étoiles
  commentaire?: string;
  userId?: string; // Optionnel pour les votes anonymes
  userEmail?: string; // Optionnel pour les votes anonymes
  userAgent: string;
  ipAddress?: string;
  sessionId: string; // Pour identifier les votes anonymes uniques
  createdAt: Date;
  isAnonymous: boolean;
}

// Types pour l'utilisateur
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin: boolean;
  createdAt: Date;
}

// Types pour les statistiques
export interface FilmStats {
  filmId: string;
  titre: string;
  totalVotes: number;
  moyenneNote: number;
  distributionNotes: {
    [key: number]: number; // note -> nombre de votes
  };
  commentaires: string[];
}

// Types pour l'authentification
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Types pour les formulaires
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FilmFormData {
  titre: string;
  realisateur: string;
  synopsis: string;
  poster: File | null;
}

export interface VoteFormData {
  note: number;
  commentaire?: string;
}

// Types pour les paramètres admin
export interface AdminSettings {
  adminPassword: string;
  batchDelay: number; // Délai en millisecondes avant envoi du batch
  allowAnonymousVotes: boolean;
  maxVotesPerUser: number; // -1 pour illimité
}

// Types pour les notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Types pour le batch voting
export interface VoteBatch {
  votes: Vote[];
  status: 'pending' | 'sending' | 'success' | 'error';
  lastAttempt: Date;
  retryCount: number;
} 
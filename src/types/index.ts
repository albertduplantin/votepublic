// Types pour l'authentification
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
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

// Types pour les films
export interface Film {
  id: string;
  titre: string;
  realisateur: string;
  pays: string;
  duree: number; // en minutes
  annee: number;
  synopsis: string;
  posterUrl?: string;
  genre: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les séances
export interface Seance {
  id: string;
  nom: string;
  description?: string;
  date: Date;
  heure: string; // format "HH:MM"
  films: string[]; // IDs des films (1 à 5 films)
  qrCodeUrl: string; // URL du QR code généré
  isActive: boolean; // si la séance est active pour le vote
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les votes
export interface Vote {
  id: string;
  seanceId: string;
  filmId: string;
  note: number; // 1 à 5
  commentaire?: string;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  userId?: string; // ID de l'utilisateur connecté
  createdAt: Date;
}

export interface VoteFormData {
  filmId: string;
  note: number;
  commentaire?: string;
}

// Types pour les résultats
export interface FilmResult {
  filmId: string;
  titre: string;
  realisateur: string;
  posterUrl?: string;
  moyenne: number;
  nombreVotes: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  commentaires: string[];
}

export interface SeanceResult {
  seanceId: string;
  nom: string;
  date: Date;
  films: FilmResult[];
  totalVotes: number;
  nombreVotants: number;
}

// Types pour l'export
export interface ExportData {
  seance: SeanceResult;
  dateExport: Date;
  format: 'pdf' | 'csv' | 'json';
}

// Types pour les paramètres admin
export interface AdminSettings {
  adminPassword: string;
  batchDelay: number; // Délai en millisecondes avant envoi du batch
  allowAnonymousVotes: boolean;
  maxVotesPerUser: number; // -1 pour illimité
}

// Types pour les formulaires de création
export interface CreateFilmData {
  titre: string;
  realisateur: string;
  pays: string;
  duree: number;
  annee: number;
  synopsis: string;
  genre: string;
  poster?: File;
}

export interface CreateSeanceData {
  nom: string;
  description?: string;
  date: Date;
  heure: string;
  films: string[]; // IDs des films (1 à 5 films)
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Types pour les statistiques
export interface Statistics {
  totalFilms: number;
  totalSeances: number;
  totalVotes: number;
  totalVotants: number;
  filmsPopulaires: FilmResult[];
  seancesPopulaires: SeanceResult[];
}

// Types pour l'export A2
export interface AfficheA2Data {
  titre: string;
  sousTitre: string;
  seances: {
    nom: string;
    date: string;
    heure: string;
    films: {
      titre: string;
      realisateur: string;
      posterUrl: string;
    }[];
    qrCodeUrl: string;
  }[];
  qrCodeGeneral: string;
  dateFestival: string;
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
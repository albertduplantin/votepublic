// Configuration Firebase
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD7Mw4NIXAdSvjoWPC9a5V4Ph3J7sXN3k4",
  authDomain: "votefilm-7b4a7.firebaseapp.com",
  projectId: "votefilm-7b4a7",
  storageBucket: "votefilm-7b4a7.firebasestorage.app",
  messagingSenderId: "448163753822",
  appId: "1:448163753822:web:650482b41651ee2922a9cf",
  measurementId: "G-YJSJC8MVQL"
};

// Configuration de l'application
export const APP_CONFIG = {
  name: "Prix du Public",
  subtitle: "Festival du Film Court de Dinan",
  version: "1.0.0",
  adminPassword: "moustache22", // Mot de passe admin par défaut
  batchDelay: 5000, // 5 secondes avant envoi du batch
  maxRetries: 3, // Nombre maximum de tentatives pour l'envoi
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
};

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Erreur de connexion. Vérifiez votre connexion internet.",
  AUTH_ERROR: "Erreur d'authentification. Veuillez réessayer.",
  VOTE_ERROR: "Erreur lors du vote. Veuillez réessayer.",
  UPLOAD_ERROR: "Erreur lors du téléchargement. Veuillez réessayer.",
  PERMISSION_ERROR: "Vous n'avez pas les permissions nécessaires.",
  VALIDATION_ERROR: "Veuillez vérifier les informations saisies.",
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  VOTE_SENT: "Vote enregistré avec succès !",
  VOTE_PENDING: "Vote en attente d'envoi...",
  FILM_ADDED: "Film ajouté avec succès !",
  FILM_UPDATED: "Film mis à jour avec succès !",
  FILM_DELETED: "Film supprimé avec succès !",
  LOGIN_SUCCESS: "Connexion réussie !",
  LOGOUT_SUCCESS: "Déconnexion réussie !",
  PASSWORD_RESET: "Email de réinitialisation envoyé !",
  PROFILE_UPDATED: "Profil mis à jour avec succès !",
};

// Validation schemas
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  TITRE_MIN_LENGTH: 2,
  TITRE_MAX_LENGTH: 100,
  REALISATEUR_MIN_LENGTH: 2,
  REALISATEUR_MAX_LENGTH: 100,
  SYNOPSIS_MIN_LENGTH: 10,
  SYNOPSIS_MAX_LENGTH: 1000,
  COMMENTAIRE_MAX_LENGTH: 500,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// Routes
export const ROUTES = {
  HOME: '/',
  VOTE: '/vote',
  FILMS: '/films',
  ADMIN: '/admin',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  RESULTS: '/results',
};

// Collections Firestore
export const COLLECTIONS = {
  USERS: 'users',
  FILMS: 'films',
  VOTES: 'votes',
  SETTINGS: 'settings',
  SESSIONS: 'sessions',
};

// Statuts de vote
export const VOTE_STATUS = {
  PENDING: 'pending',
  SENDING: 'sending',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

// Types de notification
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const; 
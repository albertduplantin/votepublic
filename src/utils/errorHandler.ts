import toast from 'react-hot-toast';
import { ERROR_MESSAGES } from './constants';

export interface AppError extends Error {
  code?: string;
  status?: number;
  context?: string;
  timestamp?: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Gère une erreur de manière centralisée
   */
  handleError(error: AppError, context?: string): void {
    const appError: AppError = {
      ...error,
      context: context || 'unknown',
      timestamp: new Date().toISOString(),
    };

    // Logger l'erreur
    this.logError(appError);

    // Afficher un message utilisateur approprié
    this.showUserMessage(appError);

    // En production, envoyer à un service de monitoring
    if (process.env.NODE_ENV === 'production') {
      this.sendToMonitoring(appError);
    }
  }

  /**
   * Logger l'erreur localement
   */
  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // Limiter la taille du log
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-50);
    }

    console.error(`[${error.context}] ${error.message}`, {
      code: error.code,
      status: error.status,
      stack: error.stack,
    });
  }

  /**
   * Afficher un message utilisateur
   */
  private showUserMessage(error: AppError): void {
    let message = ERROR_MESSAGES.NETWORK_ERROR;

    // Messages spécifiques selon le contexte
    switch (error.context) {
      case 'auth':
        message = ERROR_MESSAGES.AUTH_ERROR;
        break;
      case 'vote':
        message = ERROR_MESSAGES.VOTE_ERROR;
        break;
      case 'upload':
        message = ERROR_MESSAGES.UPLOAD_ERROR;
        break;
      case 'permission':
        message = ERROR_MESSAGES.PERMISSION_ERROR;
        break;
      case 'validation':
        message = ERROR_MESSAGES.VALIDATION_ERROR;
        break;
      default:
        // Utiliser le message d'erreur Firebase si disponible
        if (error.code && error.code.startsWith('auth/')) {
          message = this.getFirebaseErrorMessage(error.code);
        } else if (error.message) {
          message = error.message;
        }
    }

    toast.error(message);
  }

  /**
   * Envoyer l'erreur à un service de monitoring (ex: Sentry)
   */
  private sendToMonitoring(error: AppError): void {
    // TODO: Implémenter l'envoi vers un service de monitoring
    // Exemple avec Sentry:
    // Sentry.captureException(error);
  }

  /**
   * Récupérer les messages d'erreur Firebase
   */
  private getFirebaseErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Aucun utilisateur trouvé avec cet email.',
      'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/email-already-in-use': 'Cet email est déjà utilisé.',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
      'auth/invalid-email': 'Adresse email invalide.',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
      'auth/popup-closed-by-user': 'Fenêtre de connexion fermée.',
      'auth/cancelled-popup-request': 'Connexion annulée.',
      'auth/network-request-failed': 'Erreur de réseau. Vérifiez votre connexion.',
    };

    return errorMessages[code] || ERROR_MESSAGES.AUTH_ERROR;
  }

  /**
   * Récupérer l'historique des erreurs
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Vider l'historique des erreurs
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Instance singleton
export const errorHandler = ErrorHandler.getInstance();

/**
 * Wrapper pour les fonctions async avec gestion d'erreur automatique
 */
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.handleError(error as AppError, context);
      throw error;
    }
  };
};

/**
 * Hook pour gérer les erreurs dans les composants
 */
export const useErrorHandler = () => {
  const handleError = (error: AppError, context?: string) => {
    errorHandler.handleError(error, context);
  };

  return { handleError };
}; 
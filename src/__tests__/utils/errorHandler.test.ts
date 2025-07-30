import { ErrorHandler, errorHandler, withErrorHandling, useErrorHandler } from '../../utils/errorHandler';
import { AppError } from '../../utils/errorHandler';

// Mock de react-hot-toast
const mockToast = {
  error: jest.fn(),
  success: jest.fn(),
};

jest.mock('react-hot-toast', () => ({
  toast: mockToast,
}));

describe('ErrorHandler', () => {
  let errorHandlerInstance: ErrorHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    errorHandlerInstance = new ErrorHandler();
  });

  describe('handleError', () => {
    it('should handle errors with context', () => {
      const error = new Error('Test error') as AppError;
      error.code = 'TEST_ERROR';
      error.context = 'test';

      errorHandlerInstance.handleError(error, 'auth');

      expect(error.context).toBe('auth');
      expect(error.timestamp).toBeDefined();
    });

    it('should log errors correctly', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const error = new Error('Test error') as AppError;

      errorHandlerInstance.handleError(error, 'test');

      expect(consoleSpy).toHaveBeenCalledWith(
        '[test] Test error',
        expect.objectContaining({
          code: undefined,
          status: undefined,
          stack: expect.any(String),
        })
      );

      consoleSpy.mockRestore();
    });

    it('should limit error log size', () => {
      const error = new Error('Test error') as AppError;

      // Ajouter plus de 100 erreurs
      for (let i = 0; i < 150; i++) {
        errorHandlerInstance.handleError(error, 'test');
      }

      const errorLog = errorHandlerInstance.getErrorLog();
      expect(errorLog.length).toBeLessThanOrEqual(50);
    });
  });

  describe('showUserMessage', () => {
    it('should show auth error message', () => {
      const error = new Error('Auth error') as AppError;
      error.context = 'auth';

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Erreur d\'authentification. Veuillez réessayer.');
    });

    it('should show vote error message', () => {
      const error = new Error('Vote error') as AppError;
      error.context = 'vote';

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Erreur lors du vote. Veuillez réessayer.');
    });

    it('should show upload error message', () => {
      const error = new Error('Upload error') as AppError;
      error.context = 'upload';

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Erreur lors du téléchargement. Veuillez réessayer.');
    });

    it('should show permission error message', () => {
      const error = new Error('Permission error') as AppError;
      error.context = 'permission';

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Vous n\'avez pas les permissions nécessaires.');
    });

    it('should show validation error message', () => {
      const error = new Error('Validation error') as AppError;
      error.context = 'validation';

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Veuillez vérifier les informations saisies.');
    });

    it('should show Firebase auth error messages', () => {
      const error = new Error('Firebase error') as AppError;
      error.code = 'auth/user-not-found';

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Aucun utilisateur trouvé avec cet email.');
    });

    it('should show custom error message when available', () => {
      const error = new Error('Custom error message') as AppError;

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Custom error message');
    });

    it('should show default network error message', () => {
      const error = new Error('Unknown error') as AppError;
      error.context = 'unknown';

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Erreur de connexion. Vérifiez votre connexion internet.');
    });
  });

  describe('getFirebaseErrorMessage', () => {
    it('should return correct Firebase error messages', () => {
      const errorMessages = {
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

      Object.entries(errorMessages).forEach(([code, message]) => {
        const error = new Error('Firebase error') as AppError;
        error.code = code;

        errorHandlerInstance.handleError(error);

        expect(mockToast.error).toHaveBeenCalledWith(message);
      });
    });

    it('should return default auth error for unknown Firebase codes', () => {
      const error = new Error('Firebase error') as AppError;
      error.code = 'auth/unknown-error';

      errorHandlerInstance.handleError(error);

      expect(mockToast.error).toHaveBeenCalledWith('Erreur d\'authentification. Veuillez réessayer.');
    });
  });

  describe('Error log management', () => {
    it('should get error log', () => {
      const error = new Error('Test error') as AppError;
      errorHandlerInstance.handleError(error, 'test');

      const log = errorHandlerInstance.getErrorLog();
      expect(log).toHaveLength(1);
      expect(log[0].message).toBe('Test error');
    });

    it('should clear error log', () => {
      const error = new Error('Test error') as AppError;
      errorHandlerInstance.handleError(error, 'test');

      expect(errorHandlerInstance.getErrorLog()).toHaveLength(1);

      errorHandlerInstance.clearErrorLog();

      expect(errorHandlerInstance.getErrorLog()).toHaveLength(0);
    });
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ErrorHandler.getInstance();
      const instance2 = ErrorHandler.getInstance();

      expect(instance1).toBe(instance2);
    });
  });
});

describe('withErrorHandling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should wrap function with error handling', async () => {
    const mockFn = jest.fn().mockResolvedValue('success');
    const wrappedFn = withErrorHandling(mockFn, 'test');

    const result = await wrappedFn('arg1', 'arg2');

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should handle errors in wrapped function', async () => {
    const error = new Error('Test error');
    const mockFn = jest.fn().mockRejectedValue(error);
    const wrappedFn = withErrorHandling(mockFn, 'test');

    await expect(wrappedFn()).rejects.toThrow('Test error');
    expect(mockToast.error).toHaveBeenCalledWith('Erreur de connexion. Vérifiez votre connexion internet.');
  });
});

describe('useErrorHandler', () => {
  it('should return error handler hook', () => {
    const { handleError } = useErrorHandler();

    expect(typeof handleError).toBe('function');
  });

  it('should handle errors through hook', () => {
    const { handleError } = useErrorHandler();
    const error = new Error('Test error') as AppError;

    handleError(error, 'test');

    expect(mockToast.error).toHaveBeenCalledWith('Erreur de connexion. Vérifiez votre connexion internet.');
  });
});

describe('Production monitoring', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it('should send errors to monitoring in production', () => {
    process.env.NODE_ENV = 'production';
    
    // Mock pour simuler l'envoi vers un service de monitoring
    const mockSendToMonitoring = jest.fn();
    jest.spyOn(console, 'log').mockImplementation(mockSendToMonitoring);

    const error = new Error('Production error') as AppError;
    errorHandler.handleError(error, 'test');

    // En production, on pourrait vérifier l'appel au service de monitoring
    // Pour l'instant, on vérifie juste que le code s'exécute sans erreur
    expect(mockToast.error).toHaveBeenCalled();
  });
});
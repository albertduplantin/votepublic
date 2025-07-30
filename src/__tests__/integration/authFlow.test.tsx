import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { AuthProvider } from '../../contexts/AuthContext';
import * as authService from '../../services/authService';

// Mock du service d'authentification
jest.mock('../../services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Mock de react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/', state: null }),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Auth Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Flow', () => {
    it('should handle successful login', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        isAdmin: false,
        createdAt: new Date(),
      };

      mockAuthService.loginWithEmail.mockResolvedValue(mockUser);

      renderWithProviders(<LoginPage />);

      // Remplir le formulaire
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Vérifier que le service est appelé
      await waitFor(() => {
        expect(mockAuthService.loginWithEmail).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      // Vérifier la redirection
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    it('should handle login errors', async () => {
      const error = new Error('Mot de passe incorrect.');
      mockAuthService.loginWithEmail.mockRejectedValue(error);

      renderWithProviders(<LoginPage />);

      // Remplir le formulaire avec des données invalides
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      // Vérifier que l'erreur est gérée
      await waitFor(() => {
        expect(mockAuthService.loginWithEmail).toHaveBeenCalled();
      });

      // Vérifier qu'il n'y a pas de redirection
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should validate form inputs', async () => {
      renderWithProviders(<LoginPage />);

      const submitButton = screen.getByRole('button', { name: /se connecter/i });

      // Essayer de soumettre sans remplir le formulaire
      fireEvent.click(submitButton);

      // Vérifier que les erreurs de validation s'affichent
      await waitFor(() => {
        expect(screen.getByText(/adresse email invalide/i)).toBeInTheDocument();
      });

      // Vérifier que le service n'est pas appelé
      expect(mockAuthService.loginWithEmail).not.toHaveBeenCalled();
    });
  });

  describe('Register Flow', () => {
    it('should handle successful registration', async () => {
      const mockUser = {
        uid: 'newuser123',
        email: 'newuser@example.com',
        displayName: 'newuser',
        isAdmin: false,
        createdAt: new Date(),
      };

      mockAuthService.registerWithEmail.mockResolvedValue(mockUser);

      renderWithProviders(<RegisterPage />);

      // Remplir le formulaire
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Vérifier que le service est appelé
      await waitFor(() => {
        expect(mockAuthService.registerWithEmail).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'password123',
          confirmPassword: 'password123',
        });
      });

      // Vérifier la redirection
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: false });
      });
    });

    it('should validate password confirmation', async () => {
      renderWithProviders(<RegisterPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
      fireEvent.click(submitButton);

      // Vérifier que l'erreur de confirmation s'affiche
      await waitFor(() => {
        expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument();
      });

      // Vérifier que le service n'est pas appelé
      expect(mockAuthService.registerWithEmail).not.toHaveBeenCalled();
    });

    it('should validate password strength', async () => {
      renderWithProviders(<RegisterPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const confirmPasswordInput = screen.getByLabelText(/confirmer le mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: '123' } }); // Mot de passe trop court
      fireEvent.change(confirmPasswordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      // Vérifier que l'erreur de mot de passe s'affiche
      await waitFor(() => {
        expect(screen.getByText(/le mot de passe doit contenir au moins 6 caractères/i)).toBeInTheDocument();
      });

      // Vérifier que le service n'est pas appelé
      expect(mockAuthService.registerWithEmail).not.toHaveBeenCalled();
    });
  });

  describe('Google Auth Flow', () => {
    it('should handle Google login', async () => {
      const mockUser = {
        uid: 'googleuser123',
        email: 'google@example.com',
        displayName: 'Google User',
        photoURL: 'https://example.com/photo.jpg',
        isAdmin: false,
        createdAt: new Date(),
      };

      mockAuthService.loginWithGoogle.mockResolvedValue(mockUser);

      renderWithProviders(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /continuer avec google/i });
      fireEvent.click(googleButton);

      // Vérifier que le service est appelé
      await waitFor(() => {
        expect(mockAuthService.loginWithGoogle).toHaveBeenCalled();
      });

      // Vérifier la redirection
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    it('should handle Google login errors', async () => {
      const error = new Error('Fenêtre de connexion fermée.');
      mockAuthService.loginWithGoogle.mockRejectedValue(error);

      renderWithProviders(<LoginPage />);

      const googleButton = screen.getByRole('button', { name: /continuer avec google/i });
      fireEvent.click(googleButton);

      // Vérifier que l'erreur est gérée
      await waitFor(() => {
        expect(mockAuthService.loginWithGoogle).toHaveBeenCalled();
      });

      // Vérifier qu'il n'y a pas de redirection
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', async () => {
      renderWithProviders(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });

      // Email invalide
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/adresse email invalide/i)).toBeInTheDocument();
      });

      // Email valide
      fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/adresse email invalide/i)).not.toBeInTheDocument();
      });
    });

    it('should show/hide password', async () => {
      renderWithProviders(<LoginPage />);

      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

      // Par défaut, le mot de passe est masqué
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Afficher le mot de passe
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');

      // Masquer le mot de passe
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Navigation', () => {
    it('should navigate between login and register pages', () => {
      renderWithProviders(<LoginPage />);

      const registerLink = screen.getByText(/pas encore de compte/i);
      fireEvent.click(registerLink);

      // Vérifier la navigation
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('should navigate back to home from register', () => {
      renderWithProviders(<RegisterPage />);

      const backLink = screen.getByText(/retour à l'accueil/i);
      fireEvent.click(backLink);

      // Vérifier la navigation
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('Loading States', () => {
    it('should show loading state during login', async () => {
      // Simuler un délai dans le service
      mockAuthService.loginWithEmail.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({} as any), 100))
      );

      renderWithProviders(<LoginPage />);

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/mot de passe/i);
      const submitButton = screen.getByRole('button', { name: /se connecter/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      // Vérifier que le bouton est désactivé pendant le chargement
      expect(submitButton).toBeDisabled();

      // Attendre que le chargement soit terminé
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });
});
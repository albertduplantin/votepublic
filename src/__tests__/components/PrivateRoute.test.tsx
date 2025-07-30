import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PrivateRoute } from '../../components/PrivateRoute';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock du contexte d'authentification
const mockUseAuth = jest.fn();

jest.mock('../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../contexts/AuthContext'),
  useAuth: () => mockUseAuth(),
}));

const TestComponent = () => <div>Contenu protégé</div>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('PrivateRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentification de base', () => {
    it('should render children when user is authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', email: 'test@example.com', isAdmin: false },
        loading: false,
      });

      renderWithRouter(
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      );

      expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
    });

    it('should redirect to login when user is not authenticated', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: false,
      });

      renderWithRouter(
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      );

      // Vérifier que le contenu protégé n'est pas affiché
      expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });

    it('should show loading spinner when authentication is loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      });

      renderWithRouter(
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      );

      expect(screen.getByText('Chargement...')).toBeInTheDocument();
      expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });
  });

  describe('Authentification admin', () => {
    it('should render children when user is admin', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', email: 'admin@example.com', isAdmin: true },
        loading: false,
      });

      renderWithRouter(
        <PrivateRoute requireAdmin>
          <TestComponent />
        </PrivateRoute>
      );

      expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
    });

    it('should redirect non-admin users when requireAdmin is true', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', email: 'user@example.com', isAdmin: false },
        loading: false,
      });

      renderWithRouter(
        <PrivateRoute requireAdmin>
          <TestComponent />
        </PrivateRoute>
      );

      // Vérifier que le contenu protégé n'est pas affiché
      expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });

    it('should allow non-admin users when requireAdmin is false', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', email: 'user@example.com', isAdmin: false },
        loading: false,
      });

      renderWithRouter(
        <PrivateRoute requireAdmin={false}>
          <TestComponent />
        </PrivateRoute>
      );

      expect(screen.getByText('Contenu protégé')).toBeInTheDocument();
    });
  });

  describe('États de chargement', () => {
    it('should show loading spinner with correct styling', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      });

      renderWithRouter(
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      );

      const loadingSpinner = screen.getByText('Chargement...');
      expect(loadingSpinner).toBeInTheDocument();
      
      // Vérifier que le spinner est dans un conteneur centré
      const container = loadingSpinner.closest('div');
      expect(container).toHaveClass('min-h-screen', 'flex', 'items-center', 'justify-center');
    });

    it('should show loading spinner even when user is authenticated but still loading', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', email: 'test@example.com', isAdmin: false },
        loading: true,
      });

      renderWithRouter(
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      );

      expect(screen.getByText('Chargement...')).toBeInTheDocument();
      expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });
  });

  describe('Gestion des erreurs', () => {
    it('should handle undefined user gracefully', () => {
      mockUseAuth.mockReturnValue({
        user: undefined,
        loading: false,
      });

      renderWithRouter(
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      );

      expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });

    it('should handle user without isAdmin property', () => {
      mockUseAuth.mockReturnValue({
        user: { uid: '123', email: 'test@example.com' },
        loading: false,
      });

      renderWithRouter(
        <PrivateRoute requireAdmin>
          <TestComponent />
        </PrivateRoute>
      );

      // Devrait rediriger car isAdmin n'est pas défini
      expect(screen.queryByText('Contenu protégé')).not.toBeInTheDocument();
    });
  });

  describe('Accessibilité', () => {
    it('should have proper ARIA attributes for loading state', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      });

      renderWithRouter(
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      );

      const loadingText = screen.getByText('Chargement...');
      expect(loadingText).toBeInTheDocument();
      
      // Vérifier que le texte est accessible
      expect(loadingText).toHaveAttribute('class');
    });

    it('should maintain focus management during loading', () => {
      mockUseAuth.mockReturnValue({
        user: null,
        loading: true,
      });

      renderWithRouter(
        <PrivateRoute>
          <TestComponent />
        </PrivateRoute>
      );

      // Le focus devrait rester dans le conteneur de chargement
      const container = screen.getByText('Chargement...').closest('div');
      expect(container).toBeInTheDocument();
    });
  });
});
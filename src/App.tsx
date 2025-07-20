import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { ROUTES } from './utils/constants';
import './index.css';

// Pages (à créer)
const VotePage = React.lazy(() => import('./pages/VotePage').then(module => ({ default: module.VotePage })));
const FilmsPage = React.lazy(() => import('./pages/FilmsPage').then(module => ({ default: module.FilmsPage })));
const AdminPage = React.lazy(() => import('./pages/AdminPage').then(module => ({ default: module.AdminPage })));
const LoginPage = React.lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const ResultsPage = React.lazy(() => import('./pages/ResultsPage').then(module => ({ default: module.ResultsPage })));
const SeanceVotePage = React.lazy(() => import('./pages/SeanceVotePage').then(module => ({ default: module.SeanceVotePage })));

// Composant de chargement
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Chargement...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router basename="/votepublic">
      <AuthProvider>
        <div className="App">
          {/* Notifications toast */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          {/* Routes */}
          <React.Suspense fallback={<LoadingSpinner />}>
            <Layout>
              <Routes>
                {/* Page publique */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.FILMS} element={<FilmsPage />} />
                <Route path={ROUTES.VOTE} element={<VotePage />} />
                <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
                <Route path="/seance/:seanceId" element={<SeanceVotePage />} />
                
                {/* Pages d'authentification */}
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                
                {/* Pages protégées */}
                <Route
                  path={ROUTES.PROFILE}
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                
                {/* Pages admin */}
                <Route
                  path={ROUTES.ADMIN}
                  element={
                    <PrivateRoute requireAdmin>
                      <AdminPage />
                    </PrivateRoute>
                  }
                />
                
                {/* Route par défaut */}
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Layout>
          </React.Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App; 
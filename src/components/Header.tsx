import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG, ROUTES } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Fermer le menu utilisateur quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fermer le menu utilisateur quand on change de page
  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeUserMenu();
      closeMenu();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.displayName || user.email?.split('@')[0] || 'Utilisateur';
  };

  return (
    <header className="nav-festival">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link to={ROUTES.HOME} className="flex items-center space-x-3" onClick={closeMenu}>
              <div className="festival-logo"></div>
              <div className="hidden md:block">
                <h1 className="festival-title text-lg">Prix du Public</h1>
                <p className="festival-subtitle text-xs">Festival Films Courts Dinan</p>
              </div>
            </Link>
          </div>

          {/* Navigation principale - Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to={ROUTES.HOME}
              className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.HOME)
                  ? 'text-primary bg-cream'
                  : 'text-black hover:text-primary hover:bg-cream'
              }`}
            >
              ACCUEIL
            </Link>
            
            <Link
              to={ROUTES.FILMS}
              className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.FILMS)
                  ? 'text-primary bg-cream'
                  : 'text-black hover:text-primary hover:bg-cream'
              }`}
            >
              FILMS
            </Link>
            
            <Link
              to={ROUTES.VOTE}
              className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.VOTE)
                  ? 'text-primary bg-cream'
                  : 'text-black hover:text-primary hover:bg-cream'
              }`}
            >
              VOTER
            </Link>
            
            <Link
              to={ROUTES.RESULTS}
              className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(ROUTES.RESULTS)
                  ? 'text-primary bg-cream'
                  : 'text-black hover:text-primary hover:bg-cream'
              }`}
            >
              RÉSULTATS
            </Link>

            {/* Bouton admin - Desktop */}
            {user?.isAdmin && (
              <Link
                to={ROUTES.ADMIN}
                className="btn-festival text-xs px-3 py-1 ml-2"
              >
                ADMIN
              </Link>
            )}

            {/* Menu utilisateur - Desktop */}
            {user ? (
              <div className="relative ml-4">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-black hover:text-primary hover:bg-cream transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{getUserDisplayName()}</span>
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50" ref={userMenuRef}>
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{getUserDisplayName()}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="btn-festival text-xs px-3 py-1 ml-2"
              >
                CONNEXION
              </Link>
            )}
          </nav>

          {/* Bouton menu burger - Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="burger-button"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to={ROUTES.HOME}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(ROUTES.HOME)
                    ? 'text-primary bg-cream'
                    : 'text-black hover:text-primary hover:bg-cream'
                }`}
                onClick={closeMenu}
              >
                ACCUEIL
              </Link>
              
              <Link
                to={ROUTES.FILMS}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(ROUTES.FILMS)
                    ? 'text-primary bg-cream'
                    : 'text-black hover:text-primary hover:bg-cream'
                }`}
                onClick={closeMenu}
              >
                FILMS
              </Link>
              
              <Link
                to={ROUTES.VOTE}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(ROUTES.VOTE)
                    ? 'text-primary bg-cream'
                    : 'text-black hover:text-primary hover:bg-cream'
                }`}
                onClick={closeMenu}
              >
                VOTER
              </Link>
              
              <Link
                to={ROUTES.RESULTS}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(ROUTES.RESULTS)
                    ? 'text-primary bg-cream'
                    : 'text-black hover:text-primary hover:bg-cream'
                }`}
                onClick={closeMenu}
              >
                RÉSULTATS
              </Link>

              {/* Bouton admin - Mobile */}
              {user?.isAdmin && (
                <Link
                  to={ROUTES.ADMIN}
                  className="block px-3 py-2 rounded-md text-base font-medium btn-festival"
                  onClick={closeMenu}
                >
                  ADMIN
                </Link>
              )}

              {/* Menu utilisateur - Mobile */}
              {user ? (
                <>
                  <div className="px-3 py-2 border-t border-gray-200 mt-2">
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">{getUserDisplayName()}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-cream transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Se déconnecter
                  </button>
                </>
              ) : (
                <Link
                  to={ROUTES.LOGIN}
                  className="block px-3 py-2 rounded-md text-base font-medium btn-festival"
                  onClick={closeMenu}
                >
                  CONNEXION
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bannière du festival */}
      <div className="festival-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {APP_CONFIG.subtitle}
            </h2>
            <p className="text-lg md:text-xl opacity-90">
              {APP_CONFIG.edition} | 19-23 novembre 2025
            </p>
            <p className="text-sm opacity-75 mt-2">
              Votez pour vos courts métrages préférés
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}; 
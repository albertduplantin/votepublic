import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { APP_CONFIG } from '../utils/constants';
import { ROUTES } from '../utils/constants';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="nav-festival">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et titre */}
          <div className="flex items-center space-x-4">
            <Link to={ROUTES.HOME} className="flex items-center space-x-3">
              <div className="festival-logo"></div>
              <div className="hidden md:block">
                <h1 className="festival-title text-lg">Prix du Public</h1>
                <p className="festival-subtitle text-xs">Festival Films Courts Dinan</p>
              </div>
            </Link>
          </div>

          {/* Navigation principale */}
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
          </nav>

          {/* Bouton admin (mobile) */}
          <div className="md:hidden">
            <Link
              to={ROUTES.ADMIN}
              className="btn-festival text-xs px-3 py-1"
            >
              ADMIN
            </Link>
          </div>
        </div>
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
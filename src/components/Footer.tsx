import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '../utils/constants';
import { ROUTES } from '../utils/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-festival">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Logo du festival */}
          <div className="festival-logo mx-auto mb-6"></div>
          
          {/* Titre du festival */}
          <h3 className="text-xl font-bold mb-4">
            Festival Films Courts Dinan
          </h3>
          
          {/* Informations */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-3 text-primary">Le Festival</h4>
              <p className="text-sm opacity-75">
                Festival International de Courts Métrages Francophones
              </p>
              <p className="text-sm opacity-75">
                {APP_CONFIG.edition} | 19-23 novembre 2025
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-primary">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to={ROUTES.HOME} className="opacity-75 hover:opacity-100 transition-opacity">
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.FILMS} className="opacity-75 hover:opacity-100 transition-opacity">
                    Films
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.VOTE} className="opacity-75 hover:opacity-100 transition-opacity">
                    Voter
                  </Link>
                </li>
                <li>
                  <Link to={ROUTES.RESULTS} className="opacity-75 hover:opacity-100 transition-opacity">
                    Résultats
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3 text-primary">Contact</h4>
              <p className="text-sm opacity-75">
                Festival Films Courts Dinan
              </p>
              <p className="text-sm opacity-75">
                Dinan, France
              </p>
              <p className="text-sm opacity-75">
                <a 
                  href="https://festivalfilmscourts.fr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  festivalfilmscourts.fr
                </a>
              </p>
            </div>
          </div>
          
          {/* Séparateur */}
          <div className="border-t border-gray-700 pt-6 mb-6">
            <p className="text-sm opacity-75">
              © 2025 Festival Films Courts Dinan. Tous droits réservés.
            </p>
            <p className="text-xs opacity-50 mt-2">
              Prix du Public - Application de vote en ligne
            </p>
          </div>
          
          {/* Réseaux sociaux */}
          <div className="flex justify-center space-x-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <span className="text-white text-sm font-bold">f</span>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              <span className="text-white text-sm">📷</span>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-8 h-8 bg-black rounded flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <span className="text-white text-sm font-bold">X</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}; 
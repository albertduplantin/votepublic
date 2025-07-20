import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Film, Users, Award } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../utils/constants';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-primary-600">
                {APP_CONFIG.name}
              </h1>
              <p className="text-secondary-600 mt-1">
                {APP_CONFIG.subtitle}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to={ROUTES.VOTE}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Voter maintenant
              </Link>
              <Link
                to={ROUTES.FILMS}
                className="bg-secondary-100 text-secondary-700 px-6 py-2 rounded-lg hover:bg-secondary-200 transition-colors"
              >
                Voir les films
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-secondary-900 mb-6">
            Votez pour votre film préféré
          </h2>
          <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
            Participez au Prix du Public du Festival du Film Court de Dinan. 
            Votre voix compte pour élire le meilleur court métrage !
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to={ROUTES.VOTE}
              className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
            >
              Commencer à voter
            </Link>
            <Link
              to={ROUTES.FILMS}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg border border-primary-200"
            >
              Découvrir les films
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Comment ça marche ?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Film className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-secondary-900 mb-2">
                Découvrez les films
              </h4>
              <p className="text-secondary-600">
                Parcourez la sélection de courts métrages et lisez les synopsis pour faire votre choix.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-secondary-900 mb-2">
                Notez vos préférés
              </h4>
              <p className="text-secondary-600">
                Donnez une note de 1 à 5 étoiles et ajoutez un commentaire optionnel.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-secondary-900 mb-2">
                Découvrez le gagnant
              </h4>
              <p className="text-secondary-600">
                Suivez les résultats en temps réel et découvrez le Prix du Public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                <Film className="w-12 h-12 mx-auto mb-2" />
                Films en compétition
              </div>
              <p className="text-secondary-600">
                Une sélection variée de courts métrages
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                <Users className="w-12 h-12 mx-auto mb-2" />
                Spectateurs
              </div>
              <p className="text-secondary-600">
                Votez pour votre film préféré
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">
                <Star className="w-12 h-12 mx-auto mb-2" />
                Système de notation
              </div>
              <p className="text-secondary-600">
                De 1 à 5 étoiles pour chaque film
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Prêt à voter ?
          </h3>
          <p className="text-primary-100 mb-8 text-lg">
            Rejoignez les spectateurs et participez au Prix du Public
          </p>
          <Link
            to={ROUTES.VOTE}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-50 transition-colors shadow-lg"
          >
            Voter maintenant
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-secondary-300">
            © 2024 Festival du Film Court de Dinan - Prix du Public
          </p>
        </div>
      </footer>
    </div>
  );
}; 
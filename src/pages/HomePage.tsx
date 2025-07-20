import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Film, Users, Award, QrCode, Calendar } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../utils/constants';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="festival-logo mx-auto mb-8"></div>
          <h1 className="festival-title mb-4">
            Prix du Public
          </h1>
          <p className="festival-subtitle mb-8">
            {APP_CONFIG.subtitle}
          </p>
          <p className="text-lg text-gray-dark mb-8 max-w-3xl mx-auto">
            Votez pour vos courts métrages préférés et participez à l'élection du Prix du Public 
            du Festival International de Courts Métrages Francophones de Dinan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to={ROUTES.VOTE}
              className="btn-festival text-lg px-8 py-4"
            >
              Voter maintenant
            </Link>
            <Link
              to={ROUTES.FILMS}
              className="btn-festival-outline text-lg px-8 py-4"
            >
              Découvrir les films
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-black mb-12">
            Comment voter ?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card-festival text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-black mb-2">
                Scannez le QR code
              </h4>
              <p className="text-gray-dark">
                Après chaque séance, scannez le QR code affiché pour accéder au vote.
              </p>
            </div>
            <div className="card-festival text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-black mb-2">
                Notez vos films
              </h4>
              <p className="text-gray-dark">
                Donnez une note de 1 à 5 étoiles et ajoutez un commentaire optionnel.
              </p>
            </div>
            <div className="card-festival text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-black mb-2">
                Découvrez le gagnant
              </h4>
              <p className="text-gray-dark">
                Suivez les résultats en temps réel et découvrez le Prix du Public.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Festival Info Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Festival Films Courts Dinan
          </h3>
          <p className="text-xl mb-8 opacity-90">
            {APP_CONFIG.edition} | 19-23 novembre 2025
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-75" />
              <h4 className="text-lg font-semibold mb-2">5 jours de festival</h4>
              <p className="opacity-75">
                Une semaine dédiée aux courts métrages francophones
              </p>
            </div>
            <div className="text-center">
              <Film className="w-12 h-12 mx-auto mb-4 opacity-75" />
              <h4 className="text-lg font-semibold mb-2">Séances variées</h4>
              <p className="opacity-75">
                Des séances thématiques pour tous les goûts
              </p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-75" />
              <h4 className="text-lg font-semibold mb-2">Public engagé</h4>
              <p className="opacity-75">
                Votez et participez à l'élection du Prix du Public
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Prêt à voter ?
          </h3>
          <p className="text-lg mb-8 opacity-75">
            Rejoignez les spectateurs et participez au Prix du Public
          </p>
          <Link
            to={ROUTES.VOTE}
            className="btn-festival text-lg px-8 py-4"
          >
            Voter maintenant
          </Link>
        </div>
      </section>
    </div>
  );
}; 
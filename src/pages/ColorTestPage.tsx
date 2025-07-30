import React from 'react';

const ColorTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Test des Nouvelles Couleurs
        </h1>
        
        {/* Couleurs principales */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Couleurs Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-festival">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bleu Principal</h3>
              <div className="space-y-3">
                <div className="h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-medium">
                  Primary 600
                </div>
                <div className="h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Primary 500
                </div>
                <div className="h-12 bg-primary-400 rounded-lg flex items-center justify-center text-white font-medium">
                  Primary 400
                </div>
              </div>
            </div>
            
            <div className="card-festival">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Orange Secondaire</h3>
              <div className="space-y-3">
                <div className="h-12 bg-secondary-600 rounded-lg flex items-center justify-center text-white font-medium">
                  Secondary 600
                </div>
                <div className="h-12 bg-secondary-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Secondary 500
                </div>
                <div className="h-12 bg-secondary-400 rounded-lg flex items-center justify-center text-white font-medium">
                  Secondary 400
                </div>
              </div>
            </div>
            
            <div className="card-festival">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gradients</h3>
              <div className="space-y-3">
                <div className="h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center text-white font-medium">
                  Gradient Principal
                </div>
                <div className="h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-medium">
                  Gradient Secondaire
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Boutons */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Boutons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-festival">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Boutons Principaux</h3>
              <div className="space-y-4">
                <button className="btn-festival w-full">
                  Bouton Festival
                </button>
                <button className="btn-festival-outline w-full">
                  Bouton Outline
                </button>
                <button className="btn-primary w-full">
                  Bouton Primary
                </button>
                <button className="btn-secondary w-full">
                  Bouton Secondary
                </button>
              </div>
            </div>
            
            <div className="card-festival">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">États des Boutons</h3>
              <div className="space-y-4">
                <button className="btn-festival w-full" disabled>
                  Bouton Désactivé
                </button>
                <button className="btn-festival-outline w-full" disabled>
                  Outline Désactivé
                </button>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Testez le focus avec Tab pour voir l'accessibilité
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Couleurs d'accent */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Couleurs d'Accent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-festival">
              <div className="h-16 bg-success-500 rounded-lg flex items-center justify-center text-white font-medium mb-3">
                Succès
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Action réussie
              </p>
            </div>
            
            <div className="card-festival">
              <div className="h-16 bg-warning-500 rounded-lg flex items-center justify-center text-white font-medium mb-3">
                Attention
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Action requise
              </p>
            </div>
            
            <div className="card-festival">
              <div className="h-16 bg-error-500 rounded-lg flex items-center justify-center text-white font-medium mb-3">
                Erreur
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Problème détecté
              </p>
            </div>
            
            <div className="card-festival">
              <div className="h-16 bg-info-500 rounded-lg flex items-center justify-center text-white font-medium mb-3">
                Info
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Information
              </p>
            </div>
          </div>
        </section>

        {/* Système de notation */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Système de Notation
          </h2>
          <div className="card-festival">
            <div className="flex flex-wrap gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Étoiles</h3>
                <div className="rating-stars">
                  <span className="rating-star active">★</span>
                  <span className="rating-star active">★</span>
                  <span className="rating-star active">★</span>
                  <span className="rating-star">★</span>
                  <span className="rating-star">★</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Note: 3/5</h3>
                <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                  3.0
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Test de contraste */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Test de Contraste
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card-festival">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Texte sur Fond Clair</h3>
              <div className="space-y-3">
                <p className="text-gray-900 dark:text-white">Texte principal - excellent contraste</p>
                <p className="text-gray-700 dark:text-gray-300">Texte secondaire - bon contraste</p>
                <p className="text-gray-500 dark:text-gray-400">Texte tertiaire - contraste acceptable</p>
                <p className="text-primary-600 dark:text-primary-400">Lien - contraste optimal</p>
              </div>
            </div>
            
            <div className="card-festival bg-gray-900 dark:bg-gray-100">
              <h3 className="text-lg font-medium text-white dark:text-gray-900 mb-4">Texte sur Fond Sombre</h3>
              <div className="space-y-3">
                <p className="text-white dark:text-gray-900">Texte principal - excellent contraste</p>
                <p className="text-gray-300 dark:text-gray-700">Texte secondaire - bon contraste</p>
                <p className="text-gray-400 dark:text-gray-500">Texte tertiaire - contraste acceptable</p>
                <p className="text-primary-400 dark:text-primary-600">Lien - contraste optimal</p>
              </div>
            </div>
          </div>
        </section>

        {/* Instructions pour le thème sombre */}
        <section className="mb-12">
          <div className="card-festival bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900 dark:to-secondary-900">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              🌙 Test du Thème Sombre
            </h2>
            <div className="text-center space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Activez le thème sombre de votre système pour voir les couleurs s'adapter automatiquement.
              </p>
              <div className="flex justify-center space-x-4">
                                 <div className="text-sm">
                   <span className="font-medium text-gray-900 dark:text-white">Windows:</span>
                   <span className="text-gray-600 dark:text-gray-400"> Paramètres &gt; Personnalisation &gt; Couleurs</span>
                 </div>
                 <div className="text-sm">
                   <span className="font-medium text-gray-900 dark:text-white">macOS:</span>
                   <span className="text-gray-600 dark:text-gray-400"> Préférences Système &gt; Général</span>
                 </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sur mobile, le thème sombre s'active automatiquement selon les préférences système.
              </p>
            </div>
          </div>
        </section>

        {/* Accessibilité */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Tests d'Accessibilité
          </h2>
          <div className="card-festival">
            <div className="space-y-4">
              <div>
                <label htmlFor="test-input" className="form-label">Champ de test</label>
                <input
                  type="text"
                  id="test-input"
                  className="input-field"
                  placeholder="Testez le focus et le contraste"
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="btn-festival">
                  Bouton Accessible
                </button>
                <button className="btn-festival-outline">
                  Outline Accessible
                </button>
                <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">
                  Lien Accessible
                </a>
              </div>
              
              <div className="p-4 bg-success-50 dark:bg-success-900 border border-success-200 dark:border-success-700 rounded-lg">
                <p className="text-success-800 dark:text-success-200">
                  ✅ Message de succès avec excellent contraste
                </p>
              </div>
              
              <div className="p-4 bg-error-50 dark:bg-error-900 border border-error-200 dark:border-error-700 rounded-lg">
                <p className="text-error-800 dark:text-error-200">
                  ❌ Message d'erreur avec excellent contraste
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ColorTestPage; 
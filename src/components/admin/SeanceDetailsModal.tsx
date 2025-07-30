import React from 'react';
import { X, Calendar, Clock, Film, QrCode, Download, Copy } from 'lucide-react';
import { Seance, Film as FilmType } from '../../types';

interface SeanceDetailsModalProps {
  seance: Seance;
  films: FilmType[];
  onClose: () => void;
}

export const SeanceDetailsModal: React.FC<SeanceDetailsModalProps> = ({
  seance,
  films,
  onClose,
}) => {
  const handleCopyQRCode = async () => {
    try {
      await navigator.clipboard.writeText(seance.qrCodeUrl);
      // Vous pouvez ajouter un toast de succès ici
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
    }
  };

  const handleDownloadQRCode = () => {
    const link = document.createElement('a');
    link.href = seance.qrCodeUrl;
    link.download = `qr-code-${seance.nom.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Détails de la séance</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Informations de la séance */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{seance.nom}</h3>
                {seance.description && (
                  <p className="text-gray-600">{seance.description}</p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Date</p>
                    <p className="text-gray-600">{seance.date.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Heure</p>
                    <p className="text-gray-600">{seance.heure}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Film className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Nombre de films</p>
                    <p className="text-gray-600">{films.length} films</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <QrCode className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Statut</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      seance.isActive 
                        ? 'bg-success-100 text-success-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {seance.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Films de la séance */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Films de la séance</h4>
                <div className="space-y-3">
                  {films.map((film, index) => (
                    <div key={film.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{film.titre}</p>
                        <p className="text-sm text-gray-500">{film.realisateur}</p>
                        <p className="text-xs text-gray-400">
                          {film.pays} • {film.duree}min • {film.annee}
                        </p>
                        {film.synopsis && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {film.synopsis}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">QR Code de la séance</h4>
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <img
                    src={seance.qrCodeUrl}
                    alt="QR Code de la séance"
                    className="mx-auto w-48 h-48 object-contain"
                  />
                  <p className="text-sm text-gray-600 mt-3">
                    Scannez ce QR code pour accéder au vote de cette séance
                  </p>
                </div>
              </div>

              {/* Actions QR Code */}
              <div className="space-y-3">
                <button
                  onClick={handleCopyQRCode}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copier l'URL du QR code</span>
                </button>
                
                <button
                  onClick={handleDownloadQRCode}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le QR code</span>
                </button>
              </div>

              {/* URL de la séance */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">URL de la séance</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 break-all">
                    {window.location.origin}/seance/{seance.id}
                  </p>
                </div>
              </div>

              {/* Informations techniques */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Informations techniques</h4>
                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>ID de la séance:</span>
                    <span className="font-mono">{seance.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Créée le:</span>
                    <span>{seance.createdAt.toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modifiée le:</span>
                    <span>{seance.updatedAt.toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 
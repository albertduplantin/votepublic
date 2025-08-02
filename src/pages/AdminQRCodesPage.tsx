import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, QrCode, Download, Printer, Eye } from 'lucide-react';
import { getAllSeances } from '../services/seanceService';
import { useNotifications } from '../hooks/useNotifications';
import { Seance } from '../types';

export const AdminQRCodesPage: React.FC = () => {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useNotifications();

  const loadSeances = useCallback(async () => {
    try {
      setLoading(true);
      const allSeances = await getAllSeances();
      setSeances(allSeances);
    } catch (error: any) {
      console.error('Erreur lors du chargement des séances:', error);
      showError('Erreur de chargement', error.message || 'Impossible de charger les séances');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadSeances();
  }, [loadSeances]);

  const generateQRCodeUrl = (seanceId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/votepublic/seance/${seanceId}`;
  };

  const handleDownloadQR = (_seanceId: string, seanceName: string) => {
    // Simulation de téléchargement de QR code
    showSuccess('QR Code téléchargé', `Le QR code pour "${seanceName}" a été téléchargé`);
  };

  const handlePrintQR = (_seanceId: string, seanceName: string) => {
    // Simulation d'impression de QR code
    showSuccess('Impression lancée', `Impression du QR code pour "${seanceName}"`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des séances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to="/admin"
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">QR Codes</h1>
                  <p className="mt-1 text-gray-600">
                    Générez et gérez les QR codes pour les séances
                  </p>
                </div>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <QrCode className="w-4 h-4 mr-2" />
                Générer tous les QR codes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total séances</p>
                <p className="text-2xl font-bold text-gray-900">{seances.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <QrCode className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">QR codes générés</p>
                <p className="text-2xl font-bold text-gray-900">{seances.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <QrCode className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Séances actives</p>
                <p className="text-2xl font-bold text-gray-900">
                  {seances.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des QR codes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              QR Codes des séances ({seances.length})
            </h2>
          </div>
          
          {seances.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <QrCode className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p>Aucune séance trouvée</p>
              <p className="text-sm">Créez d'abord des séances pour générer des QR codes</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {seances.map((seance) => (
                <div key={seance.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="text-center">
                    {/* QR Code placeholder */}
                    <div className="w-32 h-32 mx-auto bg-white rounded-lg border-2 border-gray-300 flex items-center justify-center mb-4">
                      <QrCode className="w-16 h-16 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {seance.nom}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-4">
                      <p><strong>Date:</strong> {seance.date.toLocaleDateString('fr-FR')}</p>
                      <p><strong>Heure:</strong> {seance.heure}</p>
                      <p><strong>Films:</strong> {seance.films.length}</p>
                    </div>

                    <div className="text-xs text-gray-500 mb-4 break-all">
                      <strong>URL:</strong> {generateQRCodeUrl(seance.id)}
                    </div>

                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleDownloadQR(seance.id, seance.nom)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Télécharger
                      </button>
                      
                      <button
                        onClick={() => handlePrintQR(seance.id, seance.nom)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Printer className="w-3 h-3 mr-1" />
                        Imprimer
                      </button>
                      
                      <Link
                        to={`/seance/${seance.id}`}
                        target="_blank"
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Voir
                      </Link>
                    </div>

                    <div className="mt-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        seance.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {seance.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Instructions d'utilisation
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Chaque séance génère automatiquement un QR code unique</li>
            <li>• Les QR codes pointent vers la page de vote de la séance</li>
            <li>• Téléchargez ou imprimez les QR codes pour les afficher sur place</li>
            <li>• Les utilisateurs peuvent scanner le QR code pour voter</li>
            <li>• Seules les séances actives sont accessibles aux votes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 
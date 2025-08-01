import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AfficheA2Data } from '../types';
import { getAllSeances } from './seanceService';
import { getAllFilms } from './filmService';

/**
 * Générer un QR code pour l'application générale
 */
export const generateGeneralQRCode = (): string => {
  const baseUrl = window.location.origin + window.location.pathname;
  const appUrl = `${baseUrl}vote`;
  
  return `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(appUrl)}`;
};

/**
 * Créer une affiche A2 avec toutes les séances
 */
export const generateAfficheA2 = async (): Promise<Blob> => {
  try {
    // Récupérer toutes les séances et films
    const seances = await getAllSeances();
    const films = await getAllFilms();
    
    // Créer un Map pour accéder rapidement aux films
    const filmsMap = new Map(films.map(film => [film.id, film]));
    
    // Préparer les données pour l'affiche
    const afficheData: AfficheA2Data = {
      titre: "Prix du Public",
      sousTitre: "Festival du Film Court de Dinan",
      seances: seances.map(seance => ({
        nom: seance.nom,
        date: seance.date.toLocaleDateString('fr-FR'),
        heure: seance.heure,
        films: seance.films.map(filmId => {
          const film = filmsMap.get(filmId);
          return {
            titre: film?.titre || 'Film inconnu',
            realisateur: film?.realisateur || 'Réalisateur inconnu',
            posterUrl: film?.posterUrl || '',
          };
        }),
        qrCodeUrl: seance.qrCodeUrl,
      })),
      qrCodeGeneral: generateGeneralQRCode(),
      dateFestival: new Date().toLocaleDateString('fr-FR'),
    };
    
    // Créer le PDF A2 (420 x 594 mm)
    const pdf = new jsPDF('p', 'mm', 'a2');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Couleurs
    const primaryColor: [number, number, number] = [237, 117, 25]; // Orange
    const secondaryColor: [number, number, number] = [51, 51, 51]; // Gris foncé
    const lightGray: [number, number, number] = [245, 245, 245]; // Gris clair
    
    // En-tête
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 60, 'F');
    
    // Titre principal
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(48);
    pdf.setFont('helvetica', 'bold');
    pdf.text(afficheData.titre, pageWidth / 2, 35, { align: 'center' });
    
    // Sous-titre
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'normal');
    pdf.text(afficheData.sousTitre, pageWidth / 2, 50, { align: 'center' });
    
    // QR Code général
    const qrSize = 80;
    const qrX = pageWidth - qrSize - 20;
    const qrY = 20;
    
    // Note: Pour un vrai QR code, il faudrait utiliser une librairie comme qrcode
    // Ici on dessine un placeholder
    pdf.setFillColor(255, 255, 255);
    pdf.rect(qrX, qrY, qrSize, qrSize, 'F');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(8);
    pdf.text('QR Code', qrX + qrSize / 2, qrY + qrSize / 2, { align: 'center' });
    
    // Contenu principal
    let yPosition = 80;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    
    // Instructions
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Comment voter :', margin, yPosition);
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('1. Scannez le QR code de la séance que vous avez vue', margin, yPosition);
    yPosition += 8;
    pdf.text('2. Notez chaque film de 1 à 5 étoiles', margin, yPosition);
    yPosition += 8;
    pdf.text('3. Ajoutez un commentaire optionnel', margin, yPosition);
    yPosition += 8;
    pdf.text('4. Votre vote est anonyme et unique par film', margin, yPosition);
    
    yPosition += 20;
    
    // Séances
    afficheData.seances.forEach((seance, _) => {
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }
      
      // Titre de la séance
      pdf.setFillColor(...lightGray);
      pdf.rect(margin, yPosition - 5, contentWidth, 25, 'F');
      
      pdf.setTextColor(...secondaryColor);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${seance.nom} - ${seance.date} à ${seance.heure}`, margin + 10, yPosition + 8);
      
      // Films de la séance
      yPosition += 35;
      const filmsPerRow = 3;
      const filmWidth = (contentWidth - 20) / filmsPerRow;
      const filmHeight = 60;
      
      seance.films.forEach((film, filmIndex) => {
        const row = Math.floor(filmIndex / filmsPerRow);
        const col = filmIndex % filmsPerRow;
        const filmX = margin + 10 + col * (filmWidth + 5);
        const filmY = yPosition + row * (filmHeight + 10);
        
        // Cadre du film
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.rect(filmX, filmY, filmWidth, filmHeight);
        
        // Titre du film
        pdf.setTextColor(...secondaryColor);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        const title = film.titre.length > 20 ? film.titre.substring(0, 20) + '...' : film.titre;
        pdf.text(title, filmX + 5, filmY + 8);
        
        // Réalisateur
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        const director = film.realisateur.length > 25 ? film.realisateur.substring(0, 25) + '...' : film.realisateur;
        pdf.text(director, filmX + 5, filmY + 15);
        
        // QR Code du film (placeholder)
        const qrFilmSize = 25;
        pdf.setFillColor(240, 240, 240);
        pdf.rect(filmX + 5, filmY + 20, qrFilmSize, qrFilmSize, 'F');
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(6);
        pdf.text('QR', filmX + 5 + qrFilmSize / 2, filmY + 20 + qrFilmSize / 2, { align: 'center' });
      });
      
      yPosition += Math.ceil(seance.films.length / filmsPerRow) * (filmHeight + 10) + 20;
    });
    
    // Pied de page
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Généré le ${afficheData.dateFestival}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Retourner le PDF
    return pdf.output('blob');
  } catch (error: any) {
    throw new Error('Erreur lors de la génération de l\'affiche A2');
  }
};

/**
 * Télécharger l'affiche A2
 */
export const downloadAfficheA2 = async (): Promise<void> => {
  try {
    const blob = await generateAfficheA2();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `affiche-prix-du-public-${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error('Erreur lors du téléchargement de l\'affiche');
  }
}; 
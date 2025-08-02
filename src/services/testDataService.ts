import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';
import { Film, Seance } from '../types';

/**
 * Générer des films de test
 */
export const generateTestFilms = async (): Promise<void> => {
  const testFilms: Omit<Film, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      titre: "Le Petit Prince",
      realisateur: "Marie Dupont",
      pays: "France",
      duree: 15,
      annee: 2023,
      synopsis: "Une adaptation moderne du célèbre conte de Saint-Exupéry, explorant les thèmes de l'amitié et de l'innocence.",
      genre: "Animation",
    },
    {
      titre: "L'Écho du Temps",
      realisateur: "Jean Martin",
      pays: "Belgique",
      duree: 12,
      annee: 2023,
      synopsis: "Un voyage poétique à travers les souvenirs d'une femme âgée, mêlant passé et présent.",
      genre: "Drame",
    },
    {
      titre: "Rythmes Urbains",
      realisateur: "Sophie Laurent",
      pays: "Canada",
      duree: 18,
      annee: 2023,
      synopsis: "Un documentaire sur la vie nocturne de Montréal, capturant l'énergie et la diversité de la ville.",
      genre: "Documentaire",
    },
    {
      titre: "La Dernière Danse",
      realisateur: "Pierre Dubois",
      pays: "Suisse",
      duree: 20,
      annee: 2023,
      synopsis: "L'histoire touchante d'un danseur retraité qui retrouve sa passion grâce à une jeune élève.",
      genre: "Drame",
    },
    {
      titre: "Métamorphose",
      realisateur: "Ana Rodriguez",
      pays: "Espagne",
      duree: 14,
      annee: 2023,
      synopsis: "Une exploration visuelle de la transformation personnelle, utilisant des techniques d'animation innovantes.",
      genre: "Animation",
    },
    {
      titre: "Silence",
      realisateur: "Lucas Bernard",
      pays: "France",
      duree: 16,
      annee: 2023,
      synopsis: "Dans un monde bruyant, un homme découvre la beauté du silence et son pouvoir transformateur.",
      genre: "Expérimental",
    },
    {
      titre: "Les Gardiens de la Mémoire",
      realisateur: "Emma Wilson",
      pays: "Royaume-Uni",
      duree: 22,
      annee: 2023,
      synopsis: "Un groupe d'archivistes lutte pour préserver l'histoire d'une bibliothèque menacée de destruction.",
      genre: "Documentaire",
    },
    {
      titre: "Couleurs d'Automne",
      realisateur: "Marc Tremblay",
      pays: "Canada",
      duree: 13,
      annee: 2023,
      synopsis: "Un court métrage contemplatif sur les changements de saison et le cycle de la vie.",
      genre: "Poétique",
    }
  ];

  try {
    for (const film of testFilms) {
      await addDoc(collection(db, 'films'), {
        ...film,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    console.log('Films de test générés avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération des films de test:', error);
    throw error;
  }
};

/**
 * Générer des séances de test
 */
export const generateTestSeances = async (): Promise<void> => {
  // D'abord, récupérer tous les films pour créer les séances
  const { getDocs, collection } = await import('firebase/firestore');
  const filmsSnapshot = await getDocs(collection(db, 'films'));
  const filmIds = filmsSnapshot.docs.map(doc => doc.id);

  if (filmIds.length === 0) {
    throw new Error('Aucun film trouvé. Générez d\'abord des films de test.');
  }

  const testSeances: Omit<Seance, 'id' | 'createdAt' | 'updatedAt'>[] = [
    {
      nom: "Séance d'ouverture - Animation",
      description: "Une sélection de films d'animation innovants pour ouvrir le festival",
      date: new Date('2024-06-15'),
      heure: "20:00",
      films: filmIds.slice(0, 3), // Premier, deuxième et troisième films
      qrCodeUrl: "",
      isActive: true,
    },
    {
      nom: "Séance documentaire",
      description: "Des documentaires captivants sur des sujets variés",
      date: new Date('2024-06-16'),
      heure: "14:30",
      films: filmIds.slice(2, 5), // Troisième, quatrième et cinquième films
      qrCodeUrl: "",
      isActive: true,
    },
    {
      nom: "Séance expérimentale",
      description: "Des films expérimentaux et poétiques",
      date: new Date('2024-06-17'),
      heure: "18:00",
      films: filmIds.slice(5, 8), // Sixième, septième et huitième films
      qrCodeUrl: "",
      isActive: true,
    }
  ];

  try {
    for (const seance of testSeances) {
      await addDoc(collection(db, 'seances'), {
        ...seance,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    console.log('Séances de test générées avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération des séances de test:', error);
    throw error;
  }
};

/**
 * Générer toutes les données de test
 */
export const generateAllTestData = async (): Promise<void> => {
  try {
    console.log('Génération des données de test...');
    await generateTestFilms();
    await generateTestSeances();
    console.log('Toutes les données de test ont été générées avec succès');
  } catch (error) {
    console.error('Erreur lors de la génération des données de test:', error);
    throw error;
  }
}; 
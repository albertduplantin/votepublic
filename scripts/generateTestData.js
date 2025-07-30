// Script de génération de données de test pour le Festival du Film Court
// Usage: node scripts/generateTestData.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc } = require('firebase/firestore');

// Configuration Firebase
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD7Mw4NIXAdSvjoWPC9a5V4Ph3J7sXN3k4",
  authDomain: "votefilm-7b4a7.firebaseapp.com",
  projectId: "votefilm-7b4a7",
  storageBucket: "votefilm-7b4a7.firebasestorage.app",
  messagingSenderId: "448163753822",
  appId: "1:448163753822:web:650482b41651ee2922a9cf",
  measurementId: "G-YJSJC8MVQL"
};

// Initialiser Firebase
const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// Données de films réalistes pour le festival
const filmsData = [
  // Films français
  {
    titre: "Le Petit Bistro",
    realisateur: "Marie Dubois",
    pays: "France",
    duree: 12,
    annee: 2024,
    genre: "Comédie",
    synopsis: "Un jeune cuisinier découvre que son petit bistro parisien est visité par des clients très particuliers chaque nuit.",
    posterUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&h=400&fit=crop"
  },
  {
    titre: "Mémoire d'Été",
    realisateur: "Pierre Moreau",
    pays: "France",
    duree: 15,
    annee: 2024,
    genre: "Drame",
    synopsis: "Une femme retourne dans sa maison d'enfance pour découvrir des secrets familiaux cachés dans les murs.",
    posterUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=400&fit=crop"
  },
  {
    titre: "La Dernière Danse",
    realisateur: "Sophie Laurent",
    pays: "France",
    duree: 18,
    annee: 2024,
    genre: "Romance",
    synopsis: "Deux danseurs de rue se rencontrent et découvrent qu'ils partagent la même passion pour la liberté.",
    posterUrl: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=300&h=400&fit=crop"
  },
  {
    titre: "Le Gardien du Temps",
    realisateur: "Thomas Bernard",
    pays: "France",
    duree: 14,
    annee: 2024,
    genre: "Science-Fiction",
    synopsis: "Un horloger découvre qu'il peut manipuler le temps en réparant des montres anciennes.",
    posterUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&h=400&fit=crop"
  },
  {
    titre: "Sous la Pluie",
    realisateur: "Camille Rousseau",
    pays: "France",
    duree: 11,
    annee: 2024,
    genre: "Poétique",
    synopsis: "Un poète trouve l'inspiration en observant la vie qui continue sous la pluie parisienne.",
    posterUrl: "https://images.unsplash.com/photo-1438449805896-28a666819a20?w=300&h=400&fit=crop"
  },
  // Films belges
  {
    titre: "Les Ombres de Bruxelles",
    realisateur: "Jean-Pierre Van Damme",
    pays: "Belgique",
    duree: 16,
    annee: 2024,
    genre: "Thriller",
    synopsis: "Un détective privé enquête sur des disparitions mystérieuses dans les rues de Bruxelles.",
    posterUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop"
  },
  {
    titre: "Le Chocolat de Grand-Mère",
    realisateur: "Isabelle De Vries",
    pays: "Belgique",
    duree: 13,
    annee: 2024,
    genre: "Comédie",
    synopsis: "Une jeune femme redécouvre la recette secrète de chocolat de sa grand-mère et change sa vie.",
    posterUrl: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=300&h=400&fit=crop"
  },
  // Films suisses
  {
    titre: "Les Alpes en Hiver",
    realisateur: "Hans Müller",
    pays: "Suisse",
    duree: 17,
    annee: 2024,
    genre: "Documentaire",
    synopsis: "Un berger raconte sa vie dans les Alpes suisses et son lien avec la nature.",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop"
  },
  {
    titre: "Le Train de Minuit",
    realisateur: "Claudia Weber",
    pays: "Suisse",
    duree: 19,
    annee: 2024,
    genre: "Mystère",
    synopsis: "Un voyageur nocturne découvre que son train traverse des dimensions parallèles.",
    posterUrl: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=300&h=400&fit=crop"
  },
  // Films québécois
  {
    titre: "L'Hiver à Montréal",
    realisateur: "Marie-Claude Tremblay",
    pays: "Québec",
    duree: 14,
    annee: 2024,
    genre: "Drame",
    synopsis: "Une famille québécoise fait face aux défis de l'hiver rigoureux de Montréal.",
    posterUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=400&fit=crop"
  },
  {
    titre: "Le Pêcheur du Saint-Laurent",
    realisateur: "Jacques Bouchard",
    pays: "Québec",
    duree: 12,
    annee: 2024,
    genre: "Documentaire",
    synopsis: "Un pêcheur traditionnel raconte sa vie sur le fleuve Saint-Laurent.",
    posterUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300&h=400&fit=crop"
  },
  // Films supplémentaires pour variété
  {
    titre: "La Musique du Métro",
    realisateur: "Lucas Dubois",
    pays: "France",
    duree: 10,
    annee: 2024,
    genre: "Musical",
    synopsis: "Des musiciens de rue créent une symphonie improvisée dans le métro parisien.",
    posterUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop"
  },
  {
    titre: "Le Photographe",
    realisateur: "Emma Martin",
    pays: "France",
    duree: 15,
    annee: 2024,
    genre: "Drame",
    synopsis: "Un photographe de rue capture des moments de vie qui changent sa perspective.",
    posterUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
  },
  {
    titre: "Les Jardins Secrets",
    realisateur: "Antoine Leroy",
    pays: "France",
    duree: 13,
    annee: 2024,
    genre: "Fantastique",
    synopsis: "Une jeune femme découvre des jardins cachés qui existent entre les murs de la ville.",
    posterUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=400&fit=crop"
  },
  {
    titre: "Le Marché aux Fleurs",
    realisateur: "Céline Moreau",
    pays: "France",
    duree: 11,
    annee: 2024,
    genre: "Comédie",
    synopsis: "Un fleuriste maladroit tente de séduire sa voisine en créant des bouquets originaux.",
    posterUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=400&fit=crop"
  },
  {
    titre: "La Nuit des Étoiles",
    realisateur: "Pierre Dubois",
    pays: "France",
    duree: 16,
    annee: 2024,
    genre: "Science-Fiction",
    synopsis: "Un astronome amateur découvre un signal mystérieux venant de l'espace.",
    posterUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&h=400&fit=crop"
  },
  // Films belges supplémentaires
  {
    titre: "Le Carillon de Bruges",
    realisateur: "François Van der Berg",
    pays: "Belgique",
    duree: 14,
    annee: 2024,
    genre: "Historique",
    synopsis: "Un carillonneur raconte l'histoire de sa ville à travers la musique.",
    posterUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop"
  },
  {
    titre: "Les Diamants d'Anvers",
    realisateur: "Luc De Vries",
    pays: "Belgique",
    duree: 18,
    annee: 2024,
    genre: "Thriller",
    synopsis: "Un diamantaire découvre un complot dans le quartier des diamantaires d'Anvers.",
    posterUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=400&fit=crop"
  },
  // Films suisses supplémentaires
  {
    titre: "Le Lac Léman",
    realisateur: "Anna Schmidt",
    pays: "Suisse",
    duree: 12,
    annee: 2024,
    genre: "Poétique",
    synopsis: "Un peintre trouve l'inspiration sur les rives du lac Léman.",
    posterUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop"
  },
  {
    titre: "Les Montres de Genève",
    realisateur: "Marc-André Blanc",
    pays: "Suisse",
    duree: 15,
    annee: 2024,
    genre: "Documentaire",
    synopsis: "Un horloger genevois transmet son savoir-faire à son apprenti.",
    posterUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=300&h=400&fit=crop"
  },
  // Films québécois supplémentaires
  {
    titre: "Le Carnaval de Québec",
    realisateur: "Jean-François Gagnon",
    pays: "Québec",
    duree: 13,
    annee: 2024,
    genre: "Documentaire",
    synopsis: "Les préparatifs et la magie du célèbre carnaval de Québec.",
    posterUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=400&fit=crop"
  },
  {
    titre: "La Cabane à Sucre",
    realisateur: "Suzanne Tremblay",
    pays: "Québec",
    duree: 11,
    annee: 2024,
    genre: "Comédie",
    synopsis: "Une famille québécoise prépare la saison des sucres dans leur cabane traditionnelle.",
    posterUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=400&fit=crop"
  }
];

// Horaires des séances (19-23 novembre 2025)
const seancesData = [
  {
    nom: "Séance Découverte - Films Français",
    description: "Une sélection de courts métrages français qui vous feront découvrir de nouveaux talents du cinéma hexagonal.",
    date: new Date('2025-11-19'),
    heure: "10:00"
  },
  {
    nom: "Regards sur la Belgique",
    description: "Découvrez la richesse du cinéma belge à travers ces courts métrages qui reflètent la diversité culturelle du pays.",
    date: new Date('2025-11-19'),
    heure: "15:00"
  },
  {
    nom: "Cinéma Suisse - Entre Montagnes et Traditions",
    description: "Une immersion dans le cinéma suisse, entre modernité et respect des traditions alpines.",
    date: new Date('2025-11-20'),
    heure: "10:00"
  },
  {
    nom: "Québec - Histoires du Grand Nord",
    description: "Des histoires touchantes venues du Québec qui vous transporteront dans l'atmosphère unique du Grand Nord.",
    date: new Date('2025-11-20'),
    heure: "15:00"
  },
  {
    nom: "Comédies Francophones",
    description: "Une séance légère et divertissante avec les meilleures comédies du festival.",
    date: new Date('2025-11-21'),
    heure: "10:00"
  },
  {
    nom: "Drames et Émotions",
    description: "Des histoires poignantes qui vous toucheront au cœur et vous feront réfléchir.",
    date: new Date('2025-11-21'),
    heure: "15:00"
  },
  {
    nom: "Science-Fiction et Fantastique",
    description: "Voyagez dans des univers imaginaires avec ces courts métrages de science-fiction et fantastique.",
    date: new Date('2025-11-22'),
    heure: "10:00"
  },
  {
    nom: "Documentaires et Réalités",
    description: "Des documentaires touchants qui vous feront découvrir des réalités méconnues.",
    date: new Date('2025-11-22'),
    heure: "15:00"
  },
  {
    nom: "Séance Spéciale - Prix du Public",
    description: "Les films les plus appréciés du festival, sélectionnés par le public.",
    date: new Date('2025-11-23'),
    heure: "10:00"
  },
  {
    nom: "Clôture du Festival",
    description: "La séance de clôture avec une sélection des meilleurs films du festival.",
    date: new Date('2025-11-23'),
    heure: "15:00"
  }
];

// Fonction pour mélanger un tableau
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Fonction pour générer un ID unique
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Fonction pour générer l'URL du QR code
function generateQRCodeUrl(seanceId) {
  const baseUrl = "https://albertduplantin.github.io/votepublic";
  const seanceUrl = `${baseUrl}/seance/${seanceId}`;
  const qrServiceUrl = 'https://api.qrserver.com/v1/create-qr-code/';
  const params = new URLSearchParams({
    size: '300x300',
    data: seanceUrl,
    format: 'png',
  });
  return `${qrServiceUrl}?${params.toString()}`;
}

// Fonction principale pour générer les données
async function generateTestData() {
  try {
    console.log('🎬 Génération des données de test pour le Festival du Film Court...');
    
    // 1. Créer les films
    console.log('📽️ Création des films...');
    const films = [];
    const shuffledFilms = shuffleArray(filmsData);
    
    for (let i = 0; i < shuffledFilms.length; i++) {
      const filmData = {
        ...shuffledFilms[i],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const filmRef = await addDoc(collection(db, 'films'), filmData);
      films.push({
        id: filmRef.id,
        ...filmData
      });
      
      console.log(`✅ Film créé: ${filmData.titre} (${filmData.realisateur})`);
    }
    
    // 2. Créer les séances avec 5 films chacune
    console.log('\n🎭 Création des séances...');
    const seances = [];
    
    for (let i = 0; i < seancesData.length; i++) {
      const seanceData = seancesData[i];
      const seanceId = generateId();
      
      // Sélectionner 5 films pour cette séance
      const filmsForSeance = films.slice(i * 5, (i + 1) * 5).map(film => film.id);
      
      const seance = {
        nom: seanceData.nom,
        description: seanceData.description,
        date: seanceData.date,
        heure: seanceData.heure,
        films: filmsForSeance,
        qrCodeUrl: generateQRCodeUrl(seanceId),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const seanceRef = await addDoc(collection(db, 'seances'), seance);
      seances.push({
        id: seanceRef.id,
        ...seance
      });
      
      console.log(`✅ Séance créée: ${seanceData.nom} (${seanceData.date.toLocaleDateString()} à ${seanceData.heure})`);
      console.log(`   Films: ${filmsForSeance.length} films assignés`);
    }
    
    console.log('\n🎉 Génération terminée avec succès !');
    console.log(`📊 Statistiques:`);
    console.log(`   - ${films.length} films créés`);
    console.log(`   - ${seances.length} séances créées`);
    console.log(`   - ${films.length * seances.length} associations film-séance`);
    
    console.log('\n🌐 L\'application est prête pour les tests !');
    console.log('URL: https://albertduplantin.github.io/votepublic');
    
  } catch (error) {
    console.error('❌ Erreur lors de la génération des données:', error);
  }
}

// Exécuter le script
generateTestData(); 
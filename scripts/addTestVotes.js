const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Configuration Firebase (à adapter selon votre config)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "votepublic-XXXXX.firebaseapp.com",
  projectId: "votepublic-XXXXX",
  storageBucket: "votepublic-XXXXX.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

// Données de test - IDs des séances et films générés
const testData = {
  seances: [
    {
      id: "seance_1",
      nom: "Séance Ouverture - Courts Métrages Comédie",
      films: ["film_1", "film_2", "film_3", "film_4", "film_5"]
    },
    {
      id: "seance_2", 
      nom: "Séance Drame et Documentaires",
      films: ["film_6", "film_7", "film_8", "film_9", "film_10"]
    },
    {
      id: "seance_3",
      nom: "Séance Science-Fiction et Animation", 
      films: ["film_11", "film_12", "film_13", "film_14", "film_15"]
    }
  ]
};

// Générer des votes aléatoires
function generateRandomVote(seanceId, filmId) {
  const notes = [1, 2, 3, 4, 5];
  const commentaires = [
    "Très bon film !",
    "Intéressant",
    "Pas mal",
    "Excellent",
    "À voir absolument",
    "Décevant",
    "Original",
    "Belle réalisation",
    "Scénario captivant",
    "Visuellement superbe"
  ];

  return {
    filmId: filmId,
    seanceId: seanceId,
    note: notes[Math.floor(Math.random() * notes.length)],
    commentaire: commentaires[Math.floor(Math.random() * commentaires.length)],
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Dernière semaine
  };
}

async function addTestVotes() {
  try {
    console.log('🚀 Ajout de votes de test...');
    
    const votesToAdd = [];
    
    // Générer des votes pour chaque séance
    testData.seances.forEach(seance => {
      // 10-20 votes par séance
      const numVotes = Math.floor(Math.random() * 11) + 10;
      
      for (let i = 0; i < numVotes; i++) {
        // Voter pour 1-3 films par personne
        const numFilms = Math.floor(Math.random() * 3) + 1;
        const selectedFilms = seance.films
          .sort(() => 0.5 - Math.random())
          .slice(0, numFilms);
        
        selectedFilms.forEach(filmId => {
          votesToAdd.push(generateRandomVote(seance.id, filmId));
        });
      }
    });
    
    console.log(`📊 Génération de ${votesToAdd.length} votes...`);
    
    // Ajouter les votes en batch
    const batchSize = 50;
    for (let i = 0; i < votesToAdd.length; i += batchSize) {
      const batch = votesToAdd.slice(i, i + batchSize);
      
      const promises = batch.map(vote => 
        addDoc(collection(db, 'votes'), vote)
      );
      
      await Promise.all(promises);
      console.log(`✅ Ajouté ${Math.min(i + batchSize, votesToAdd.length)}/${votesToAdd.length} votes`);
    }
    
    console.log('🎉 Votes de test ajoutés avec succès !');
    console.log(`📈 Total: ${votesToAdd.length} votes répartis sur ${testData.seances.length} séances`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des votes:', error);
  }
}

// Exécuter le script
addTestVotes(); 
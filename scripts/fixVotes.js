const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } = require('firebase/firestore');

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

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

async function fixVotes() {
  try {
    console.log('🔧 Correction des votes...\n');
    
    // Récupérer les séances avec leurs films
    console.log('📽️ Récupération des séances...');
    const seancesSnapshot = await getDocs(collection(db, 'seances'));
    const seances = [];
    seancesSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.films && data.films.length > 0) {
        seances.push({
          id: doc.id,
          nom: data.nom,
          films: data.films
        });
      }
    });
    
    console.log(`   ${seances.length} séances valides trouvées`);
    
    // Supprimer les votes existants sans seanceId
    console.log('\n🗑️ Suppression des votes invalides...');
    const votesSnapshot = await getDocs(collection(db, 'votes'));
    const votesToDelete = [];
    votesSnapshot.forEach(doc => {
      const data = doc.data();
      if (!data.seanceId || data.seanceId === '') {
        votesToDelete.push(doc.id);
      }
    });
    
    if (votesToDelete.length > 0) {
      console.log(`   Suppression de ${votesToDelete.length} votes invalides...`);
      for (const voteId of votesToDelete) {
        await deleteDoc(doc(db, 'votes', voteId));
      }
      console.log('   ✅ Votes invalides supprimés');
    } else {
      console.log('   ✅ Aucun vote invalide trouvé');
    }
    
    // Générer des votes de test pour chaque séance
    console.log('\n🗳️ Génération de votes de test...');
    
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
      "Visuellement superbe",
      "Émouvant",
      "Drôle",
      "Profond",
      "Innovant",
      "Classique"
    ];
    
    let totalVotesAdded = 0;
    
    for (const seance of seances) {
      console.log(`   📊 Génération pour "${seance.nom}"...`);
      
      // 15-25 votes par séance
      const numVotes = Math.floor(Math.random() * 11) + 15;
      
      for (let i = 0; i < numVotes; i++) {
        // Chaque personne vote pour 1-3 films de la séance
        const numFilms = Math.floor(Math.random() * 3) + 1;
        const selectedFilms = seance.films
          .sort(() => 0.5 - Math.random())
          .slice(0, numFilms);
        
        for (const filmId of selectedFilms) {
          const vote = {
            filmId: filmId,
            seanceId: seance.id,
            note: Math.floor(Math.random() * 5) + 1, // 1-5
            commentaire: commentaires[Math.floor(Math.random() * commentaires.length)],
            ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            sessionId: `session_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Dernière semaine
          };
          
          await addDoc(collection(db, 'votes'), vote);
          totalVotesAdded++;
        }
      }
      
      console.log(`   ✅ ${numVotes} personnes ont voté pour cette séance`);
    }
    
    console.log(`\n🎉 Opération terminée !`);
    console.log(`📈 Total: ${totalVotesAdded} votes ajoutés pour ${seances.length} séances`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la correction:', error);
  }
}

// Exécuter le script
fixVotes(); 
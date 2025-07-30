const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

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

async function checkData() {
  try {
    console.log('🔍 Vérification des données existantes...\n');
    
    // Vérifier les séances
    console.log('📽️ SÉANCES:');
    const seancesSnapshot = await getDocs(collection(db, 'seances'));
    const seances = [];
    seancesSnapshot.forEach(doc => {
      const data = doc.data();
      seances.push({
        id: doc.id,
        nom: data.nom,
        films: data.films,
        date: data.date?.toDate?.() || data.date
      });
    });
    
    console.log(`   ${seances.length} séances trouvées:`);
    seances.forEach(seance => {
      console.log(`   - ${seance.id}: "${seance.nom}" (${seance.films?.length || 0} films)`);
    });
    
    // Vérifier les films
    console.log('\n🎬 FILMS:');
    const filmsSnapshot = await getDocs(collection(db, 'films'));
    const films = [];
    filmsSnapshot.forEach(doc => {
      const data = doc.data();
      films.push({
        id: doc.id,
        titre: data.titre,
        realisateur: data.realisateur
      });
    });
    
    console.log(`   ${films.length} films trouvés:`);
    films.slice(0, 10).forEach(film => {
      console.log(`   - ${film.id}: "${film.titre}" par ${film.realisateur}`);
    });
    if (films.length > 10) {
      console.log(`   ... et ${films.length - 10} autres films`);
    }
    
    // Vérifier les votes
    console.log('\n🗳️ VOTES:');
    const votesSnapshot = await getDocs(collection(db, 'votes'));
    const votes = [];
    votesSnapshot.forEach(doc => {
      const data = doc.data();
      votes.push({
        id: doc.id,
        filmId: data.filmId,
        seanceId: data.seanceId,
        note: data.note
      });
    });
    
    console.log(`   ${votes.length} votes trouvés`);
    
    if (votes.length > 0) {
      // Analyser les votes par séance
      const votesBySeance = {};
      votes.forEach(vote => {
        if (!votesBySeance[vote.seanceId]) {
          votesBySeance[vote.seanceId] = [];
        }
        votesBySeance[vote.seanceId].push(vote);
      });
      
      console.log('   Répartition par séance:');
      Object.entries(votesBySeance).forEach(([seanceId, seanceVotes]) => {
        const seance = seances.find(s => s.id === seanceId);
        console.log(`   - ${seanceId}: ${seanceVotes.length} votes ${seance ? `(${seance.nom})` : ''}`);
      });
    }
    
    console.log('\n✅ Vérification terminée !');
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error);
  }
}

// Exécuter le script
checkData(); 
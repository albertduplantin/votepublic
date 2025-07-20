import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { FIREBASE_CONFIG } from '../utils/constants';

// Initialiser Firebase
const app = initializeApp(FIREBASE_CONFIG);

// Initialiser les services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialiser Analytics (seulement si supporté)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

// Connecter aux émulateurs en développement
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
  } catch (error) {
    console.warn('Émulateurs déjà connectés ou non disponibles');
  }
}

export default app; 
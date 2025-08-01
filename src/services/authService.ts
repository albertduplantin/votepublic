import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, LoginFormData, RegisterFormData } from '../types';
import { COLLECTIONS } from '../utils/constants';

// Provider Google
const googleProvider = new GoogleAuthProvider();

/**
 * Connexion avec email et mot de passe
 */
export const loginWithEmail = async (data: LoginFormData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    
    const user = await getUserData(userCredential.user.uid);
    return user;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Inscription avec email et mot de passe
 */
export const registerWithEmail = async (data: RegisterFormData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Créer le profil utilisateur
    const userData: Omit<User, 'uid'> = {
      email: data.email,
      displayName: data.email.split('@')[0],
      isAdmin: false,
      createdAt: new Date(),
    };

    await setDoc(doc(db, COLLECTIONS.USERS, userCredential.user.uid), userData);

    return {
      uid: userCredential.user.uid,
      ...userData,
    };
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Connexion avec Google
 */
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Vérifier si l'utilisateur existe déjà
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));

    if (!userDoc.exists()) {
      // Créer un nouvel utilisateur
      const userData: Omit<User, 'uid'> = {
        email: user.email!,
        displayName: user.displayName || user.email!.split('@')[0],
        ...(user.photoURL ? { photoURL: user.photoURL } : {}),
        isAdmin: false,
        createdAt: new Date(),
      };

      await setDoc(doc(db, COLLECTIONS.USERS, user.uid), userData);

      return {
        uid: user.uid,
        ...userData,
      };
    } else {
      // Récupérer les données existantes
      return await getUserData(user.uid);
    }
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Déconnexion
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Réinitialisation du mot de passe
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Mise à jour du profil
 */
export const updateUserProfile = async (
  uid: string,
  updates: Partial<User>
): Promise<void> => {
  try {
    // Mettre à jour Firebase Auth si nécessaire
    if (auth.currentUser && auth.currentUser.uid === uid) {
      await updateProfile(auth.currentUser, {
        displayName: updates.displayName ?? null,
        photoURL: updates.photoURL ?? null,
      });
    }

    // Mettre à jour Firestore
    const userRef = doc(db, COLLECTIONS.USERS, uid);
    await updateDoc(userRef, updates);
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

/**
 * Récupérer les données utilisateur depuis Firestore
 */
export const getUserData = async (uid: string): Promise<User> => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    
    if (!userDoc.exists()) {
      throw new Error('Utilisateur non trouvé');
    }

    const userData = userDoc.data();
    return {
      uid,
      ...userData,
      createdAt: userData.createdAt?.toDate() || new Date(),
    } as User;
  } catch (error: any) {
    throw new Error('Erreur lors de la récupération des données utilisateur');
  }
};

/**
 * Écouter les changements d'état d'authentification
 */
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const user = await getUserData(firebaseUser.uid);
        callback(user);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Traduire les codes d'erreur Firebase
 */
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Aucun utilisateur trouvé avec cet email.',
    'auth/wrong-password': 'Mot de passe incorrect.',
    'auth/email-already-in-use': 'Cet email est déjà utilisé.',
    'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
    'auth/invalid-email': 'Adresse email invalide.',
    'auth/too-many-requests': 'Trop de tentatives. Réessayez plus tard.',
    'auth/popup-closed-by-user': 'Fenêtre de connexion fermée.',
    'auth/cancelled-popup-request': 'Connexion annulée.',
    'auth/network-request-failed': 'Erreur de réseau. Vérifiez votre connexion.',
  };

  return errorMessages[errorCode] || 'Une erreur est survenue lors de l\'authentification.';
}; 
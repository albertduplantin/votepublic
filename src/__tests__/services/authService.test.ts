import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  logout,
  resetPassword,
  updateUserProfile,
  getUserData,
} from '../../services/authService';
import { auth, db } from '../../services/firebase';
import { User, LoginFormData, RegisterFormData } from '../../types';

// Mock Firebase
jest.mock('../../services/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));

// Mock Firebase Auth
const mockSignInWithEmailAndPassword = jest.fn();
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithPopup = jest.fn();
const mockSignOut = jest.fn();
const mockSendPasswordResetEmail = jest.fn();
const mockUpdateProfile = jest.fn();
const mockOnAuthStateChanged = jest.fn();

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: mockSignInWithEmailAndPassword,
  createUserWithEmailAndPassword: mockCreateUserWithEmailAndPassword,
  signInWithPopup: mockSignInWithPopup,
  signOut: mockSignOut,
  sendPasswordResetEmail: mockSendPasswordResetEmail,
  updateProfile: mockUpdateProfile,
  onAuthStateChanged: mockOnAuthStateChanged,
  GoogleAuthProvider: jest.fn(),
}));

// Mock Firestore
const mockSetDoc = jest.fn();
const mockGetDoc = jest.fn();
const mockUpdateDoc = jest.fn();

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: mockSetDoc,
  getDoc: mockGetDoc,
  updateDoc: mockUpdateDoc,
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loginWithEmail', () => {
    const loginData: LoginFormData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        uid: 'user123',
        email: 'test@example.com',
      };

      const mockUserData: User = {
        uid: 'user123',
        email: 'test@example.com',
        displayName: 'Test User',
        isAdmin: false,
        createdAt: new Date(),
      };

      mockSignInWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email: 'test@example.com',
          displayName: 'Test User',
          isAdmin: false,
          createdAt: new Date(),
        }),
      });

      const result = await loginWithEmail(loginData);

      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        loginData.email,
        loginData.password
      );
      expect(result).toEqual(mockUserData);
    });

    it('should throw error for invalid credentials', async () => {
      const error = { code: 'auth/wrong-password' };
      mockSignInWithEmailAndPassword.mockRejectedValue(error);

      await expect(loginWithEmail(loginData)).rejects.toThrow(
        'Mot de passe incorrect.'
      );
    });

    it('should throw error for user not found', async () => {
      const error = { code: 'auth/user-not-found' };
      mockSignInWithEmailAndPassword.mockRejectedValue(error);

      await expect(loginWithEmail(loginData)).rejects.toThrow(
        'Aucun utilisateur trouvé avec cet email.'
      );
    });
  });

  describe('registerWithEmail', () => {
    const registerData: RegisterFormData = {
      email: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };

    it('should register successfully with valid data', async () => {
      const mockUser = {
        uid: 'newuser123',
        email: 'newuser@example.com',
      };

      mockCreateUserWithEmailAndPassword.mockResolvedValue({
        user: mockUser,
      });

      mockSetDoc.mockResolvedValue(undefined);

      const result = await registerWithEmail(registerData);

      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        auth,
        registerData.email,
        registerData.password
      );
      expect(mockSetDoc).toHaveBeenCalled();
      expect(result.uid).toBe('newuser123');
      expect(result.email).toBe('newuser@example.com');
      expect(result.isAdmin).toBe(false);
    });

    it('should throw error for weak password', async () => {
      const error = { code: 'auth/weak-password' };
      mockCreateUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(registerWithEmail(registerData)).rejects.toThrow(
        'Le mot de passe doit contenir au moins 6 caractères.'
      );
    });

    it('should throw error for email already in use', async () => {
      const error = { code: 'auth/email-already-in-use' };
      mockCreateUserWithEmailAndPassword.mockRejectedValue(error);

      await expect(registerWithEmail(registerData)).rejects.toThrow(
        'Cet email est déjà utilisé.'
      );
    });
  });

  describe('loginWithGoogle', () => {
    it('should login successfully with Google', async () => {
      const mockUser = {
        uid: 'googleuser123',
        email: 'google@example.com',
        displayName: 'Google User',
        photoURL: 'https://example.com/photo.jpg',
      };

      const mockUserData: User = {
        uid: 'googleuser123',
        email: 'google@example.com',
        displayName: 'Google User',
        photoURL: 'https://example.com/photo.jpg',
        isAdmin: false,
        createdAt: new Date(),
      };

      mockSignInWithPopup.mockResolvedValue({
        user: mockUser,
      });

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => ({
          email: 'google@example.com',
          displayName: 'Google User',
          photoURL: 'https://example.com/photo.jpg',
          isAdmin: false,
          createdAt: new Date(),
        }),
      });

      const result = await loginWithGoogle();

      expect(mockSignInWithPopup).toHaveBeenCalled();
      expect(result).toEqual(mockUserData);
    });

    it('should create new user if Google user does not exist', async () => {
      const mockUser = {
        uid: 'newgoogleuser123',
        email: 'newgoogle@example.com',
        displayName: 'New Google User',
        photoURL: 'https://example.com/photo.jpg',
      };

      mockSignInWithPopup.mockResolvedValue({
        user: mockUser,
      });

      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      mockSetDoc.mockResolvedValue(undefined);

      const result = await loginWithGoogle();

      expect(mockSetDoc).toHaveBeenCalled();
      expect(result.uid).toBe('newgoogleuser123');
      expect(result.email).toBe('newgoogle@example.com');
      expect(result.isAdmin).toBe(false);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      mockSignOut.mockResolvedValue(undefined);

      await logout();

      expect(mockSignOut).toHaveBeenCalledWith(auth);
    });

    it('should handle logout errors', async () => {
      const error = { code: 'auth/network-request-failed' };
      mockSignOut.mockRejectedValue(error);

      await expect(logout()).rejects.toThrow(
        'Erreur de réseau. Vérifiez votre connexion.'
      );
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email successfully', async () => {
      const email = 'test@example.com';
      mockSendPasswordResetEmail.mockResolvedValue(undefined);

      await resetPassword(email);

      expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(auth, email);
    });

    it('should handle password reset errors', async () => {
      const email = 'nonexistent@example.com';
      const error = { code: 'auth/user-not-found' };
      mockSendPasswordResetEmail.mockRejectedValue(error);

      await expect(resetPassword(email)).rejects.toThrow(
        'Aucun utilisateur trouvé avec cet email.'
      );
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const uid = 'user123';
      const updates = {
        displayName: 'Updated Name',
        photoURL: 'https://example.com/new-photo.jpg',
      };

      auth.currentUser = {
        uid: 'user123',
        email: 'test@example.com',
      } as any;

      mockUpdateProfile.mockResolvedValue(undefined);
      mockUpdateDoc.mockResolvedValue(undefined);

      await updateUserProfile(uid, updates);

      expect(mockUpdateProfile).toHaveBeenCalledWith(auth.currentUser, updates);
      expect(mockUpdateDoc).toHaveBeenCalled();
    });

    it('should handle profile update errors', async () => {
      const uid = 'user123';
      const updates = { displayName: 'New Name' };

      const error = { code: 'auth/network-request-failed' };
      mockUpdateDoc.mockRejectedValue(error);

      await expect(updateUserProfile(uid, updates)).rejects.toThrow(
        'Erreur de réseau. Vérifiez votre connexion.'
      );
    });
  });

  describe('getUserData', () => {
    it('should get user data successfully', async () => {
      const uid = 'user123';
      const mockUserData = {
        email: 'test@example.com',
        displayName: 'Test User',
        isAdmin: false,
        createdAt: new Date(),
      };

      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockUserData,
      });

      const result = await getUserData(uid);

      expect(result).toEqual({
        uid,
        ...mockUserData,
      });
    });

    it('should throw error if user does not exist', async () => {
      const uid = 'nonexistent123';

      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      await expect(getUserData(uid)).rejects.toThrow('Utilisateur non trouvé');
    });

    it('should handle data retrieval errors', async () => {
      const uid = 'user123';

      mockGetDoc.mockRejectedValue(new Error('Database error'));

      await expect(getUserData(uid)).rejects.toThrow(
        'Erreur lors de la récupération des données utilisateur'
      );
    });
  });
});
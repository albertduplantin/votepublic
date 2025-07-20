# Guide de Configuration Firebase - Prix du Public

Ce guide vous accompagne étape par étape pour configurer Firebase pour l'application Prix du Public.

## 🚀 Étape 1 : Créer un projet Firebase

1. **Aller sur la console Firebase**
   - Ouvrir [console.firebase.google.com](https://console.firebase.google.com)
   - Se connecter avec votre compte Google

2. **Créer un nouveau projet**
   - Cliquer sur "Créer un projet"
   - Nom du projet : `prix-du-public-dinan` (ou votre nom préféré)
   - Désactiver Google Analytics (optionnel)
   - Cliquer sur "Créer le projet"

## 🔐 Étape 2 : Configurer l'Authentification

1. **Activer l'authentification**
   - Dans le menu de gauche, cliquer sur "Authentication"
   - Cliquer sur "Commencer"

2. **Configurer les méthodes de connexion**
   - **Email/Mot de passe** :
     - Cliquer sur "Email/Mot de passe"
     - Activer "Email/Mot de passe"
     - Cliquer sur "Enregistrer"
   
   - **Google** :
     - Cliquer sur "Google"
     - Activer "Google"
     - Ajouter un nom de projet de support (ex: "Prix du Public")
     - Cliquer sur "Enregistrer"

3. **Configurer les domaines autorisés**
   - Aller dans l'onglet "Paramètres"
   - Dans "Domaines autorisés", ajouter :
     - `localhost` (pour le développement)
     - `votre-username.github.io` (pour la production)

## 🗄️ Étape 3 : Configurer Firestore Database

1. **Créer la base de données**
   - Dans le menu de gauche, cliquer sur "Firestore Database"
   - Cliquer sur "Créer une base de données"
   - Choisir "Mode production" (plus sécurisé)
   - Choisir l'emplacement le plus proche (ex: europe-west3)
   - Cliquer sur "Suivant"

2. **Configurer les règles de sécurité**
   - Aller dans l'onglet "Règles"
   - Remplacer le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Films - lecture publique, écriture admin
    match /films/{filmId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Votes - lecture admin, écriture publique
    match /votes/{voteId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow create: if true;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users - lecture/écriture propriétaire, lecture admin
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Settings - lecture/écriture admin
    match /settings/{settingId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

3. **Publier les règles**
   - Cliquer sur "Publier"

## 📁 Étape 4 : Configurer Storage

1. **Créer le bucket de stockage**
   - Dans le menu de gauche, cliquer sur "Storage"
   - Cliquer sur "Commencer"
   - Choisir l'emplacement (même que Firestore)
   - Cliquer sur "Suivant"

2. **Configurer les règles de sécurité**
   - Aller dans l'onglet "Règles"
   - Remplacer le contenu par :

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posters/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

3. **Publier les règles**
   - Cliquer sur "Publier"

## ⚙️ Étape 5 : Récupérer la configuration

1. **Accéder aux paramètres du projet**
   - Cliquer sur l'icône ⚙️ à côté de "Vue d'ensemble du projet"
   - Sélectionner "Paramètres du projet"

2. **Récupérer la configuration**
   - Aller dans l'onglet "Général"
   - Descendre jusqu'à "Vos applications"
   - Cliquer sur l'icône Web (</>) si une app web existe, sinon cliquer sur "Ajouter une application" puis l'icône Web
   - Donner un nom à l'application (ex: "Prix du Public Web")
   - Cliquer sur "Enregistrer l'app"

3. **Copier la configuration**
   - La configuration s'affiche sous cette forme :
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "prix-du-public-dinan.firebaseapp.com",
     projectId: "prix-du-public-dinan",
     storageBucket: "prix-du-public-dinan.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef..."
   };
   ```

## 🔧 Étape 6 : Intégrer dans l'application

1. **Modifier le fichier de configuration**
   - Ouvrir `src/utils/constants.ts`
   - Remplacer la configuration Firebase par vos vraies valeurs :

```typescript
export const FIREBASE_CONFIG = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};
```

2. **Tester la configuration**
   ```bash
   npm start
   ```

## 👤 Étape 7 : Créer un compte admin

1. **Créer un compte utilisateur**
   - Lancer l'application
   - Aller sur la page de connexion
   - Créer un compte avec email/mot de passe

2. **Promouvoir en admin**
   - Aller dans la console Firebase
   - Firestore Database > Données
   - Trouver la collection `users`
   - Cliquer sur le document de votre utilisateur
   - Ajouter un champ : `isAdmin` avec la valeur `true`
   - Sauvegarder

3. **Tester l'accès admin**
   - Se reconnecter à l'application
   - Aller sur `/admin`
   - Vous devriez avoir accès au dashboard admin

## 🔒 Étape 8 : Sécurité supplémentaire

1. **Configurer les domaines autorisés**
   - Dans Authentication > Paramètres
   - Ajouter vos domaines de production

2. **Configurer les règles Firestore**
   - Vérifier que les règles sont bien publiées
   - Tester les permissions

3. **Configurer les règles Storage**
   - Vérifier que les règles sont bien publiées
   - Tester l'upload d'images

## 🚀 Étape 9 : Déploiement

1. **Configurer GitHub Pages**
   - Aller dans les paramètres de votre repo GitHub
   - Pages > Source : Deploy from a branch
   - Branch : gh-pages

2. **Mettre à jour l'URL**
   - Dans `package.json`, modifier :
   ```json
   {
     "homepage": "https://votre-username.github.io/prix-du-public"
   }
   ```

3. **Ajouter le domaine de production**
   - Dans Firebase Auth > Paramètres
   - Ajouter : `votre-username.github.io`

## 🐛 Dépannage

### Erreurs courantes

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Vérifier qu'il n'y a qu'une seule initialisation Firebase

2. **"Permission denied"**
   - Vérifier les règles Firestore/Storage
   - Vérifier que l'utilisateur est bien admin

3. **"Network error"**
   - Vérifier les domaines autorisés dans Firebase Auth
   - Vérifier la configuration CORS

### Logs utiles

- Console du navigateur (F12)
- Logs Firebase dans la console
- Logs Firestore dans la console

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier ce guide étape par étape
2. Consulter la documentation Firebase
3. Vérifier les logs d'erreur
4. Ouvrir une issue sur GitHub 
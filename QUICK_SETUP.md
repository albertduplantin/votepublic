# Configuration rapide Firebase - Prix du Public

## ✅ Configuration déjà intégrée

Votre configuration Firebase a été intégrée dans l'application :
- **Project ID** : `votefilm-7b4a7`
- **Auth Domain** : `votefilm-7b4a7.firebaseapp.com`
- **Storage** : `votefilm-7b4a7.firebasestorage.app`

## 🚀 Étapes à suivre dans la console Firebase

### 1. Activer l'Authentification
1. Aller sur [console.firebase.google.com](https://console.firebase.google.com)
2. Sélectionner votre projet `votefilm-7b4a7`
3. Menu gauche → **Authentication** → **Commencer**
4. Onglet **Sign-in method**
5. Activer **Email/Password** et **Google**
6. Onglet **Settings** → **Authorized domains**
7. Ajouter : `localhost` et votre domaine de production

### 2. Créer Firestore Database
1. Menu gauche → **Firestore Database** → **Créer une base de données**
2. Choisir **Mode production**
3. Sélectionner l'emplacement (ex: `europe-west3`)
4. Cliquer **Suivant**

### 3. Configurer les règles Firestore
1. Onglet **Règles**
2. Remplacer par :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /films/{filmId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    match /votes/{voteId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow create: if true;
      allow update, delete: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    match /settings/{settingId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```
3. Cliquer **Publier**

### 4. Configurer Storage
1. Menu gauche → **Storage** → **Commencer**
2. Choisir l'emplacement (même que Firestore)
3. Onglet **Règles**
4. Remplacer par :
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
5. Cliquer **Publier**

## 🧪 Tester l'application

1. **Lancer l'application** : `npm start`
2. **Ouvrir** : `http://localhost:3000`
3. **Tester** :
   - Page d'accueil
   - Navigation entre les pages
   - Créer un compte utilisateur
   - Se connecter avec Google

## 👤 Créer un compte admin

1. **Créer un compte** via l'interface de connexion
2. **Aller dans Firestore** → **Données**
3. **Collection** `users` → votre document utilisateur
4. **Ajouter un champ** : `isAdmin` = `true`
5. **Sauvegarder**

## 🎯 Fonctionnalités à tester

- ✅ Navigation entre les pages
- ✅ Création de compte
- ✅ Connexion Google
- ✅ Page de vote (interface)
- ✅ Liste des films
- ⏳ Ajout de films (admin)
- ⏳ Système de vote (après ajout de films)

## 🐛 En cas de problème

1. **Vérifier la console** du navigateur (F12)
2. **Vérifier les logs** Firebase
3. **Vérifier les règles** Firestore/Storage
4. **Vérifier les domaines** autorisés dans Auth

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier ce guide étape par étape
2. Consulter la documentation Firebase
3. Vérifier les logs d'erreur 
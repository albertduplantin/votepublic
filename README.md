# Prix du Public - Festival du Film Court de Dinan

Système de vote en ligne pour le Festival du Film Court de Dinan. Permet aux spectateurs de voter pour leurs films préférés avec un système de notation par étoiles et des commentaires.

## 🎬 Fonctionnalités

- **Vote anonyme** : Les spectateurs peuvent voter sans créer de compte
- **Système de notation** : Notes de 1 à 5 étoiles avec commentaires optionnels
- **Vote unique** : Un seul vote par film par utilisateur
- **Batch voting** : Optimisé pour les réseaux instables (jusqu'à 200 utilisateurs simultanés)
- **Interface admin** : Gestion des films, visualisation des résultats en temps réel
- **Responsive design** : Compatible mobile avec menu burger
- **Export PDF** : Génération de rapports de résultats

## 🚀 Technologies

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS
- **Backend** : Firebase (Firestore + Storage + Auth)
- **Formulaires** : React Hook Form + Zod
- **Notifications** : React Hot Toast
- **Déploiement** : GitHub Pages + GitHub Actions

## 📋 Prérequis

- Node.js 18+
- Compte Firebase
- Compte GitHub

## 🛠️ Installation

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/prix-du-public.git
   cd prix-du-public
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration Firebase**

   a. Créer un nouveau projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
   
   b. Activer les services suivants :
      - Authentication (Email/Password + Google)
      - Firestore Database
      - Storage
   
   c. Récupérer la configuration Firebase et remplacer dans `src/utils/constants.ts` :
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

4. **Configuration des règles Firestore**

   Dans la console Firebase, aller dans Firestore > Règles et ajouter :
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

5. **Configuration des règles Storage**

   Dans la console Firebase, aller dans Storage > Règles et ajouter :
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

## 🏃‍♂️ Développement

1. **Démarrer le serveur de développement**
   ```bash
   npm start
   ```

2. **Ouvrir [http://localhost:3000](http://localhost:3000)**

3. **Tests**
   ```bash
   npm test
   ```

## 🚀 Déploiement

1. **Configurer GitHub Pages**

   a. Aller dans Settings > Pages
   b. Source : Deploy from a branch
   c. Branch : gh-pages
   d. Folder : / (root)

2. **Mettre à jour l'URL dans package.json**
   ```json
   {
     "homepage": "https://votre-username.github.io/prix-du-public"
   }
   ```

3. **Pousser sur GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

4. **Le déploiement se fait automatiquement via GitHub Actions**

## 👤 Configuration Admin

1. **Créer un compte utilisateur** via l'interface de connexion
2. **Dans Firestore**, modifier manuellement le document utilisateur :
   ```javascript
   {
     "isAdmin": true
   }
   ```
3. **Mot de passe admin par défaut** : `moustache22`

## 📱 Utilisation

### Pour les spectateurs
1. Aller sur la page de vote
2. Parcourir les films disponibles
3. Donner une note de 1 à 5 étoiles
4. Ajouter un commentaire optionnel
5. Le vote est envoyé automatiquement après 5 secondes

### Pour l'admin
1. Se connecter avec un compte admin
2. Accéder au dashboard admin
3. Ajouter/modifier/supprimer des films
4. Visualiser les résultats en temps réel
5. Exporter les résultats en PDF

## 🔧 Configuration avancée

### Variables d'environnement
Créer un fichier `.env.local` :
```env
REACT_APP_FIREBASE_API_KEY=votre_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=votre_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=votre_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=votre_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=votre_app_id
```

### Personnalisation
- **Couleurs** : Modifier `tailwind.config.js`
- **Messages** : Modifier `src/utils/constants.ts`
- **Validation** : Modifier les schémas Zod dans les composants

## 🐛 Dépannage

### Erreurs courantes
1. **Firebase non configuré** : Vérifier la configuration dans `constants.ts`
2. **Règles Firestore** : Vérifier les permissions dans la console Firebase
3. **CORS** : Configurer les domaines autorisés dans Firebase Auth

### Logs
Les logs sont disponibles dans la console du navigateur et dans les logs Firebase.

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème, ouvrir une issue sur GitHub. 
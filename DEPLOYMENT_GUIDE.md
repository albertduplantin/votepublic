# 🚀 Guide de Déploiement - Prix du Public

## 📋 **Prérequis**

### **1. Compte GitHub**
- ✅ Avoir un compte GitHub
- ✅ Créer un nouveau repository

### **2. Configuration Firebase**
- ✅ Firebase configuré (suivre `QUICK_SETUP.md`)
- ✅ Domaines autorisés dans Firebase Auth

## 🎯 **Option 1 : Déploiement GitHub Pages (Recommandé)**

### **Étapes :**

#### **1. Créer le repository GitHub**
```bash
# Initialiser Git (si pas déjà fait)
git init
git add .
git commit -m "Initial commit - Prix du Public"

# Créer le repository sur GitHub
# Aller sur github.com → New repository → "votepublic"
```

#### **2. Configurer le repository**
```bash
# Ajouter l'origin
git remote add origin https://github.com/VOTRE_USERNAME/votepublic.git
git branch -M main
git push -u origin main
```

#### **3. Activer GitHub Pages**
1. **Aller sur** votre repository GitHub
2. **Settings** → **Pages**
3. **Source** : `Deploy from a branch`
4. **Branch** : `gh-pages` (sera créé automatiquement)
5. **Folder** : `/ (root)`
6. **Save**

#### **4. Configurer les domaines Firebase**
1. **Console Firebase** → **Authentication** → **Settings**
2. **Authorized domains**
3. **Ajouter** : `VOTRE_USERNAME.github.io`

#### **5. Déployer automatiquement**
Le workflow GitHub Actions se déclenchera automatiquement à chaque push sur `main`.

### **URL de l'application :**
- **Production** : `https://VOTRE_USERNAME.github.io/votepublic`
- **Développement** : `http://localhost:3000`

## 🔧 **Option 2 : Déploiement manuel**

### **Build de production :**
```bash
# Installer les dépendances
npm install

# Build de production
npm run build

# Tester le build localement
npx serve -s build
```

### **Déployer sur GitHub Pages :**
```bash
# Installer gh-pages
npm install --save-dev gh-pages

# Déployer
npm run deploy
```

## 🌐 **Option 3 : Autres plateformes**

### **Netlify (Gratuit) :**
1. **Connecter** le repository GitHub
2. **Build command** : `npm run build`
3. **Publish directory** : `build`
4. **Deploy**

### **Vercel (Gratuit) :**
1. **Importer** le repository GitHub
2. **Framework Preset** : Create React App
3. **Deploy**

### **Firebase Hosting :**
```bash
# Installer Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialiser
firebase init hosting

# Build et déploy
npm run build
firebase deploy
```

## ⚙️ **Configuration post-déploiement**

### **1. Variables d'environnement**
Créer `.env.production` :
```env
REACT_APP_FIREBASE_API_KEY=AIzaSyD7Mw4NIXAdSvjoWPC9a5V4Ph3J7sXN3k4
REACT_APP_FIREBASE_AUTH_DOMAIN=votefilm-7b4a7.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=votefilm-7b4a7
REACT_APP_FIREBASE_STORAGE_BUCKET=votefilm-7b4a7.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=448163753822
REACT_APP_FIREBASE_APP_ID=1:448163753822:web:650482b41651ee2922a9cf
REACT_APP_FIREBASE_MEASUREMENT_ID=G-YJSJC8MVQL
```

### **2. Domaines autorisés Firebase**
- ✅ `localhost`
- ✅ `VOTRE_USERNAME.github.io`
- ✅ Votre domaine personnalisé (si applicable)

### **3. Règles de sécurité**
Vérifier que les règles Firestore et Storage sont configurées (voir `QUICK_SETUP.md`)

## 🧪 **Test post-déploiement**

### **Fonctionnalités à vérifier :**
- ✅ **Page d'accueil** se charge
- ✅ **Navigation** fonctionne
- ✅ **Authentification** Firebase
- ✅ **Upload d'images** (Storage)
- ✅ **Système de vote** (Firestore)
- ✅ **Responsive design**

### **Tests de performance :**
- ✅ **Lighthouse** : Score > 90
- ✅ **Core Web Vitals** : Optimisés
- ✅ **Temps de chargement** : < 3s

## 🔒 **Sécurité**

### **Règles Firestore :**
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
  }
}
```

### **Règles Storage :**
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

## 🚨 **Dépannage**

### **Erreurs courantes :**
1. **404 sur les routes** : Configurer le basename dans React Router
2. **Erreurs Firebase** : Vérifier les domaines autorisés
3. **Build échoue** : Vérifier les variables d'environnement
4. **Images ne se chargent pas** : Vérifier les règles Storage

### **Logs utiles :**
- **GitHub Actions** : Voir les logs de build
- **Firebase Console** : Logs d'authentification et Firestore
- **Console navigateur** : Erreurs JavaScript

## 📈 **Monitoring**

### **Analytics :**
- ✅ **Firebase Analytics** : Intégré automatiquement
- ✅ **Google Analytics** : Ajouter le tracking ID
- ✅ **Performance monitoring** : Firebase Performance

### **Uptime :**
- ✅ **GitHub Pages** : 99.9% uptime
- ✅ **Firebase** : 99.95% uptime
- ✅ **Monitoring** : UptimeRobot (gratuit)

## 🎉 **Félicitations !**

Votre application **Prix du Public** est maintenant déployée et accessible publiquement !

**URL finale** : `https://VOTRE_USERNAME.github.io/votepublic`

L'application est :
- ✅ **Gratuite** (GitHub Pages + Firebase)
- ✅ **Automatiquement déployée** (GitHub Actions)
- ✅ **Sécurisée** (Firebase Auth + Firestore)
- ✅ **Performante** (React optimisé)
- ✅ **Responsive** (Mobile-first)

**Prochaine étape** : Configurer Firebase et tester toutes les fonctionnalités ! 🚀 
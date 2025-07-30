# 🔒 Configuration des Règles de Sécurité Firebase

## 📋 **Problème identifié**

L'erreur "Missing or insufficient permissions" indique que les règles de sécurité Firebase ne sont pas correctement configurées pour permettre la lecture des séances.

## 🚀 **Solution : Déployer les règles de sécurité**

### **Étape 1 : Installer Firebase CLI**
```bash
npm install -g firebase-tools
```

### **Étape 2 : Se connecter à Firebase**
```bash
firebase login
```

### **Étape 3 : Initialiser Firebase (si pas déjà fait)**
```bash
firebase init
```

Sélectionner :
- ✅ Firestore
- ✅ Storage
- ✅ Hosting (optionnel)

### **Étape 4 : Déployer les règles Firestore**
```bash
firebase deploy --only firestore:rules
```

### **Étape 5 : Déployer les règles Storage**
```bash
firebase deploy --only storage
```

## 📁 **Fichiers de règles créés**

### **firestore.rules**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Séances - lecture publique, écriture admin
    match /seances/{seanceId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Films - lecture publique, écriture admin
    match /films/{filmId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Votes - lecture admin, création publique
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

### **storage.rules**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Posters - lecture publique, écriture admin
    match /posters/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
  }
}
```

## 🔧 **Configuration via Console Firebase (Alternative)**

Si vous préférez utiliser la console web :

### **1. Firestore Rules**
1. Aller sur [Console Firebase](https://console.firebase.google.com)
2. Sélectionner votre projet
3. **Firestore Database** → **Règles**
4. Copier-coller le contenu de `firestore.rules`
5. **Publier**

### **2. Storage Rules**
1. **Storage** → **Règles**
2. Copier-coller le contenu de `storage.rules`
3. **Publier**

## ✅ **Vérification**

Après le déploiement des règles :

1. **Recharger** l'application
2. **Vérifier** que l'erreur "Missing or insufficient permissions" a disparu
3. **Tester** la lecture des séances et films
4. **Tester** la création de votes

## 🎯 **Règles de sécurité expliquées**

### **Lecture publique (`allow read: if true`)**
- ✅ **Séances** : Tout le monde peut voir les séances
- ✅ **Films** : Tout le monde peut voir les films
- ✅ **Images** : Tout le monde peut voir les posters

### **Écriture admin seulement**
- 🔒 **Séances** : Seuls les admins peuvent créer/modifier
- 🔒 **Films** : Seuls les admins peuvent créer/modifier
- 🔒 **Images** : Seuls les admins peuvent uploader

### **Votes**
- ✅ **Création** : Tout le monde peut voter
- 🔒 **Lecture/Modification** : Seuls les admins peuvent voir/modifier

## 🚨 **Sécurité**

Ces règles garantissent :
- ✅ **Accès public** aux données de consultation
- 🔒 **Protection** des données sensibles
- ✅ **Vote ouvert** pour tous les utilisateurs
- 🔒 **Administration** sécurisée

---

**Après avoir déployé ces règles, l'erreur de permissions devrait disparaître !** 🎉 
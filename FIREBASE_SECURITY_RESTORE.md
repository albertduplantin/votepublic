# 🔒 Restauration des Règles de Sécurité Firebase

## ⚠️ **Règles Temporaires Actives**

Actuellement, les règles Firestore sont configurées pour permettre l'accès complet pendant les tests :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles temporaires pour les tests - accès complet
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## ✅ **Test de l'Application**

Avec ces règles temporaires, l'application devrait maintenant fonctionner sans erreur de permissions. Testez :

1. **Navigation** vers les séances
2. **Création** de nouvelles séances
3. **Lecture** des films
4. **Système de vote**

## 🔒 **Restauration des Règles de Sécurité**

Une fois que l'application fonctionne correctement, restaurez les règles de sécurité :

### **1. Remplacer le contenu de `firestore.rules` :**

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

### **2. Déployer les nouvelles règles :**

```bash
firebase deploy --only firestore:rules
```

## 🎯 **Règles de Sécurité Expliquées**

### **Lecture Publique (`allow read: if true`)**
- ✅ **Séances** : Tout le monde peut voir les séances
- ✅ **Films** : Tout le monde peut voir les films

### **Écriture Admin Seulement**
- 🔒 **Séances** : Seuls les admins peuvent créer/modifier
- 🔒 **Films** : Seuls les admins peuvent créer/modifier

### **Votes**
- ✅ **Création** : Tout le monde peut voter
- 🔒 **Lecture/Modification** : Seuls les admins peuvent voir/modifier

### **Utilisateurs**
- 🔒 **Propriétaire** : Chaque utilisateur peut lire/modifier ses données
- 🔒 **Admin** : Les admins peuvent lire toutes les données utilisateur

## 🚨 **Sécurité en Production**

Ces règles garantissent :
- ✅ **Accès public** aux données de consultation
- 🔒 **Protection** des données sensibles
- ✅ **Vote ouvert** pour tous les utilisateurs
- 🔒 **Administration** sécurisée

## 📋 **Checklist de Restauration**

- [ ] Tester que l'application fonctionne avec les règles temporaires
- [ ] Restaurer le contenu de `firestore.rules`
- [ ] Déployer les nouvelles règles : `firebase deploy --only firestore:rules`
- [ ] Tester que l'application fonctionne toujours
- [ ] Vérifier que les permissions sont correctes

---

**⚠️ Important : Ne pas laisser les règles temporaires en production !** 
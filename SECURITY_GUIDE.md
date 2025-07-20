# 🔒 Guide de Sécurité - Variables d'Environnement

## 🚨 **Problème résolu**

La clé API Firebase était exposée publiquement dans le code. Elle a été déplacée vers des variables d'environnement pour sécuriser l'application.

## 🔧 **Configuration requise**

### **1. Créer le fichier `.env`**

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Configuration Firebase
REACT_APP_FIREBASE_API_KEY=AIzaSyD7Mw4NIXAdSvjoWPC9a5V4Ph3J7sXN3k4
REACT_APP_FIREBASE_AUTH_DOMAIN=votefilm-7b4a7.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=votefilm-7b4a7
REACT_APP_FIREBASE_STORAGE_BUCKET=votefilm-7b4a7.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=448163753822
REACT_APP_FIREBASE_APP_ID=1:448163753822:web:650482b41651ee2922a9cf
REACT_APP_FIREBASE_MEASUREMENT_ID=G-YJSJC8MVQL
```

### **2. Pour le développement local**

```bash
# Copier le fichier d'exemple
cp env.production.example .env

# Démarrer l'application
npm start
```

### **3. Pour la production (GitHub Pages)**

Les variables d'environnement sont configurées dans les secrets GitHub Actions.

## 🛡️ **Mesures de sécurité**

### **✅ Fichiers sécurisés**
- `.env` est dans `.gitignore`
- Les clés API ne sont plus dans le code source
- Variables d'environnement utilisées

### **⚠️ Actions recommandées**

1. **Révoquer l'ancienne clé API** :
   - Allez sur [Google Cloud Console](https://console.cloud.google.com/)
   - Projet : `votefilm-7b4a7`
   - APIs & Services → Credentials
   - Supprimez l'ancienne clé API

2. **Créer une nouvelle clé API** :
   - Créez une nouvelle clé API Firebase
   - Mettez à jour le fichier `.env`
   - Mettez à jour les secrets GitHub

3. **Vérifier les logs** :
   - Vérifiez les logs Firebase pour détecter d'éventuels abus
   - Surveillez l'utilisation de l'API

## 🔄 **Déploiement sécurisé**

### **GitHub Actions**

Les variables d'environnement sont configurées dans les secrets GitHub :
- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- etc.

### **Variables d'environnement**

Toutes les variables Firebase commencent par `REACT_APP_` pour être accessibles côté client.

## 📋 **Checklist de sécurité**

- [ ] Fichier `.env` créé avec les bonnes variables
- [ ] Ancienne clé API révoquée
- [ ] Nouvelle clé API créée
- [ ] Secrets GitHub mis à jour
- [ ] Application testée en local
- [ ] Déploiement vérifié

## 🚀 **Déploiement**

```bash
# Commit et push des changements
git add .
git commit -m "🔒 Sécurisation : Variables d'environnement Firebase"
git push origin main

# Déploiement
npm run deploy
```

## 📞 **Support**

En cas de problème :
1. Vérifiez que le fichier `.env` existe
2. Vérifiez les variables d'environnement
3. Testez en local avec `npm start`
4. Vérifiez les logs de build

---

**⚠️ Important** : Ne jamais commiter le fichier `.env` dans Git ! 
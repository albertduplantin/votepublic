# 🎬 Système de QR Codes et Séances - Prix du Public

## 🎯 **Vue d'ensemble**

Le système de QR codes permet aux spectateurs de voter facilement pour les films qu'ils ont vus en scannant un QR code spécifique à chaque séance.

## 📱 **Parcours utilisateur**

### **1. Dans la salle de cinéma**
- **Après la séance** : 5 miniatures de films s'affichent sur l'écran
- **QR code unique** : Un QR code sous chaque miniature
- **Scan** : Le spectateur scanne le QR code de la séance
- **Vote** : Il arrive sur la page de vote pour cette séance spécifique

### **2. Dans le hall**
- **Panneau d'affichage** : Toutes les séances avec leurs QR codes
- **Scan** : Le spectateur peut scanner n'importe quel QR code
- **Vote** : Il vote pour les films de la séance correspondante

### **3. Vote unique**
- **Un seul vote** par film par utilisateur
- **Vote anonyme** par défaut
- **Commentaires optionnels**
- **Système de notation** : 1 à 5 étoiles

## 🏗️ **Architecture technique**

### **1. Structure des données**
```typescript
interface Seance {
  id: string;
  nom: string;
  description?: string;
  date: Date;
  heure: string;
  films: string[]; // IDs des films
  qrCodeUrl: string; // URL du QR code
  createdAt: Date;
  updatedAt: Date;
}
```

### **2. QR Codes**
- **Génération automatique** lors de la création d'une séance
- **URL unique** : `https://albertduplantin.github.io/votepublic/seance/{seanceId}`
- **API QR Server** : Génération en temps réel
- **Taille optimisée** : 300x300px pour l'affichage

### **3. Routes**
- **Page de vote par séance** : `/seance/:seanceId`
- **Interface dédiée** pour chaque séance
- **Vote en batch** pour tous les films de la séance

## 🎨 **Interface utilisateur**

### **1. Page de vote par séance**
- **En-tête** : Nom de la séance, date, heure, nombre de films
- **Instructions** : Comment voter (1-5 étoiles)
- **Grille de films** : Posters, titres, réalisateurs
- **Système de notation** : Étoiles interactives
- **Commentaires** : Zone de texte optionnelle
- **Statistiques** : Moyennes et nombre de votes (si disponibles)
- **Bouton d'envoi** : Soumission de tous les votes

### **2. Responsive design**
- **Mobile-first** : Optimisé pour les smartphones
- **Grille adaptative** : 1-3 colonnes selon l'écran
- **Boutons tactiles** : Taille optimisée pour le touch

## 🔧 **Configuration admin**

### **1. Créer une séance**
1. **Aller sur** la page Admin
2. **Section Séances** → **Ajouter une séance**
3. **Remplir** :
   - Nom de la séance
   - Description (optionnel)
   - Date et heure
   - Sélectionner les films
4. **Sauvegarder** : Le QR code est généré automatiquement

### **2. Gérer les séances**
- **Modifier** : Changer les films, dates, etc.
- **Supprimer** : Supprimer une séance
- **Voir les QR codes** : Télécharger ou afficher
- **Voir les résultats** : Statistiques par séance

### **3. Export A2**
- **Générer l'affiche** : Toutes les séances sur une page A2
- **QR codes intégrés** : Un par séance
- **Design professionnel** : Prêt pour l'impression
- **Téléchargement PDF** : Format A2 (420x594mm)

## 📊 **Fonctionnalités avancées**

### **1. Vote par batch**
- **Optimisé** pour les réseaux instables
- **Délai de 5 secondes** avant envoi
- **Retry automatique** en cas d'échec
- **Jusqu'à 200 utilisateurs** simultanés

### **2. Statistiques en temps réel**
- **Moyennes** par film
- **Distribution** des notes (1-5 étoiles)
- **Nombre de votes** total
- **Commentaires** des spectateurs

### **3. Sécurité**
- **Vote unique** : Un seul vote par film par session
- **Vérification** : IP, User Agent, Session ID
- **Anonymat** : Pas de collecte de données personnelles

## 🚀 **Déploiement et test**

### **1. Test local**
```bash
npm start
# Aller sur http://localhost:3000/seance/test-seance-id
```

### **2. Test QR codes**
1. **Créer une séance** via l'interface admin
2. **Copier l'URL** du QR code
3. **Scanner** avec un smartphone
4. **Vérifier** que la page de vote s'affiche

### **3. Test d'affichage**
1. **Générer l'affiche A2** via l'admin
2. **Télécharger** le PDF
3. **Imprimer** en A2
4. **Tester** les QR codes imprimés

## 📋 **Checklist de mise en production**

### **1. Configuration Firebase**
- ✅ **Règles Firestore** : Permissions pour les séances
- ✅ **Domaines autorisés** : GitHub Pages
- ✅ **Storage** : Pour les posters de films

### **2. Interface admin**
- ✅ **Gestion des séances** : CRUD complet
- ✅ **Gestion des films** : Ajout, modification, suppression
- ✅ **Export A2** : Génération d'affiches
- ✅ **Statistiques** : Visualisation des résultats

### **3. Interface utilisateur**
- ✅ **Page de vote par séance** : Interface dédiée
- ✅ **Système de notation** : Étoiles interactives
- ✅ **Commentaires** : Zone de texte
- ✅ **Responsive design** : Mobile-first

### **4. QR Codes**
- ✅ **Génération automatique** : À la création de séance
- ✅ **URLs uniques** : Par séance
- ✅ **Test de scan** : Fonctionnement vérifié
- ✅ **Affichage** : Taille et qualité optimisées

## 🎉 **Avantages du système**

### **1. Pour les spectateurs**
- **Simplicité** : Scan et vote en quelques clics
- **Rapidité** : Interface optimisée
- **Anonymat** : Pas de compte requis
- **Flexibilité** : Vote depuis n'importe où

### **2. Pour les organisateurs**
- **Facilité de gestion** : Interface admin intuitive
- **Statistiques détaillées** : Résultats en temps réel
- **Affiches automatiques** : Export A2 prêt à imprimer
- **Scalabilité** : Jusqu'à 200 utilisateurs simultanés

### **3. Pour le festival**
- **Engagement** : Participation facilitée
- **Données précises** : Votes uniques et vérifiés
- **Communication** : QR codes sur tous les supports
- **Professionnalisme** : Interface moderne et fiable

## 🔮 **Évolutions futures**

### **1. Fonctionnalités avancées**
- **QR codes individuels** : Un par film
- **Géolocalisation** : Vérification de présence
- **Notifications** : Rappels de vote
- **Gamification** : Badges, classements

### **2. Intégrations**
- **Réseaux sociaux** : Partage des résultats
- **API externe** : Export vers d'autres systèmes
- **Analytics** : Statistiques détaillées
- **Multi-langues** : Support international

Le système de QR codes transforme l'expérience de vote en festival, la rendant plus accessible, engageante et moderne ! 🚀 
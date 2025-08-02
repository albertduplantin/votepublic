# Guide du Tableau de Bord Admin

## Vue d'ensemble

Le tableau de bord admin de VotePublic offre une vue complète et en temps réel des statistiques du festival. Il permet aux administrateurs de suivre l'activité, analyser les tendances et prendre des décisions éclairées.

## Fonctionnalités principales

### 1. Statistiques en temps réel

Le tableau de bord affiche automatiquement :
- **Total des votes** : Nombre total de votes enregistrés
- **Films en compétition** : Nombre de films dans la base de données
- **Note moyenne** : Note moyenne globale de tous les films
- **Séances actives** : Nombre de séances actuellement actives

### 2. Film en tête

Affiche automatiquement le film avec la meilleure note moyenne, incluant :
- Titre du film
- Note moyenne
- Nombre de votes reçus
- Position dans le classement

### 3. Activité récente

Liste les 10 derniers votes avec :
- Action effectuée (ex: "Vote 4/5")
- Film concerné
- Horodatage de l'action

### 4. Progression des votes

Barre de progression visuelle montrant :
- Objectif de 1000 votes
- Progression actuelle en pourcentage
- Nombre de votes actuels

## Statistiques détaillées

### Votes par jour (7 derniers jours)

Graphique en barres montrant :
- Nombre de votes par jour
- Progression relative (barres de progression)
- Dates formatées en français

### Répartition par genre

Analyse de la distribution des films par genre :
- Nombre de films par genre
- Barres de progression relatives
- Vue d'ensemble de la programmation

### Métriques supplémentaires

#### Taux de participation
- Calculé sur la base du nombre total de séances
- Estimation basée sur 50 votes par séance
- Affiché en pourcentage

#### Utilisateurs uniques
- Nombre d'utilisateurs ayant participé au vote
- Basé sur les IDs utilisateur uniques
- Indicateur de l'engagement

#### Séances totales
- Nombre total de séances créées
- Distinction entre séances actives et inactives
- Vue d'ensemble de la programmation

## Fonctionnalités d'administration

### Bouton d'actualisation
- Actualisation manuelle des données
- Animation de chargement pendant l'actualisation
- Notifications de succès/erreur

### Actualisation automatique
- Mise à jour automatique toutes les 5 minutes
- Pas d'interruption de l'expérience utilisateur
- Données toujours à jour

## Navigation rapide

Le tableau de bord inclut des liens directs vers :
- **Gestion des Séances** : Création et modification des séances
- **Gestion des Films** : Ajout et modification des films
- **Résultats des Votes** : Visualisation détaillée des résultats
- **Gestion des Utilisateurs** : Administration des comptes
- **QR Codes** : Génération et gestion des QR codes
- **Base de Données** : Sauvegardes et maintenance
- **Sécurité** : Paramètres de sécurité et logs
- **Paramètres** : Configuration générale

## Utilisation

### Accès au tableau de bord
1. Connectez-vous en tant qu'administrateur
2. Accédez à la page d'administration (`/admin`)
3. Le tableau de bord se charge automatiquement

### Actualisation des données
- **Automatique** : Toutes les 5 minutes
- **Manuelle** : Cliquez sur le bouton "Actualiser"
- **Au chargement** : À chaque visite de la page

### Interprétation des données

#### Indicateurs de performance
- **Taux de participation élevé** : Bon engagement du public
- **Note moyenne > 3.5** : Qualité des films bien reçue
- **Activité récente régulière** : Festival dynamique

#### Alertes
- **Aucun vote récent** : Vérifier la connectivité ou l'engagement
- **Taux de participation faible** : Revoir la communication
- **Note moyenne basse** : Analyser la programmation

## Personnalisation

### Couleurs et thème
- Utilise le système de couleurs du festival
- Cohérent avec le reste de l'application
- Interface responsive et moderne

### Données affichées
- Toutes les données proviennent de Firebase
- Calculs en temps réel
- Pas de cache pour garantir l'exactitude

## Support technique

### Dépendances
- Firebase Firestore pour les données
- React Hooks pour la gestion d'état
- Tailwind CSS pour le style
- Lucide React pour les icônes

### Performance
- Chargement optimisé des données
- Actualisation intelligente
- Interface fluide et réactive

## Maintenance

### Surveillance
- Vérifier régulièrement les logs de console
- Surveiller les erreurs de chargement
- Contrôler la performance des requêtes

### Mises à jour
- Les nouvelles fonctionnalités sont automatiquement intégrées
- Compatibilité avec les versions précédentes
- Documentation mise à jour régulièrement

---

*Ce guide est mis à jour régulièrement pour refléter les nouvelles fonctionnalités du tableau de bord.* 
# Guide d'Administration - VotePublic

## Comment devenir administrateur

### Méthode 1 : Via Firebase Console (Recommandée)

1. **Accéder à Firebase Console**
   - Allez sur [Firebase Console](https://console.firebase.google.com/)
   - Sélectionnez votre projet VotePublic

2. **Accéder à Firestore Database**
   - Dans le menu de gauche, cliquez sur "Firestore Database"
   - Cliquez sur l'onglet "Données"

3. **Trouver l'utilisateur**
   - Dans la collection `users`, trouvez l'utilisateur que vous voulez promouvoir admin
   - L'ID du document correspond à l'UID de l'utilisateur Firebase

4. **Modifier les permissions**
   - Cliquez sur le document de l'utilisateur
   - Modifiez le champ `isAdmin` de `false` à `true`
   - Cliquez sur "Mettre à jour"

### Méthode 2 : Via le code (Développement)

Si vous avez accès au code source, vous pouvez temporairement modifier le service d'authentification :

```typescript
// Dans src/services/authService.ts, ligne ~45
const userData: Omit<User, 'uid'> = {
  email: data.email,
  displayName: data.email.split('@')[0],
  photoURL: undefined,
  isAdmin: true, // Changer false en true
  createdAt: new Date(),
};
```

**⚠️ Important :** N'oubliez pas de remettre `false` après avoir créé votre compte admin !

### Méthode 3 : Via Firebase CLI

1. **Installer Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Se connecter**
   ```bash
   firebase login
   ```

3. **Accéder à Firestore**
   ```bash
   firebase firestore:get users/[USER_UID]
   ```

4. **Mettre à jour l'utilisateur**
   ```bash
   firebase firestore:update users/[USER_UID] --data '{"isAdmin": true}'
   ```

## Vérification du statut admin

Une fois que vous êtes admin :

1. **Connectez-vous** à l'application
2. **Le bouton "ADMIN"** apparaîtra dans le header (desktop et mobile)
3. **Cliquez sur "ADMIN"** pour accéder à l'interface d'administration

## Fonctionnalités admin disponibles

- **Gestion des films** : Ajouter, modifier, supprimer des films
- **Résultats** : Visualiser les votes en temps réel
- **Utilisateurs** : Gérer les comptes utilisateurs
- **Paramètres** : Configuration du système

## Sécurité

- Seuls les utilisateurs avec `isAdmin: true` peuvent accéder à la page admin
- La route `/admin` est protégée par le composant `PrivateRoute`
- Les utilisateurs non-admin sont automatiquement redirigés vers la page d'accueil

## Dépannage

### Le bouton ADMIN n'apparaît pas
- Vérifiez que vous êtes connecté
- Vérifiez que `isAdmin: true` dans Firestore
- Rafraîchissez la page

### Erreur d'accès à la page admin
- Vérifiez que vous êtes connecté
- Vérifiez vos permissions dans Firestore
- Déconnectez-vous et reconnectez-vous

### Problème de synchronisation
- Attendez quelques secondes pour la synchronisation Firebase
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez votre connexion internet 
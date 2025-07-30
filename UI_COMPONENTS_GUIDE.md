# Guide des Composants UI - VotePublic

Ce guide documente les nouveaux composants UI modernes ajoutés au projet VotePublic pour améliorer l'expérience utilisateur.

## 🎨 Composants Principaux

### 1. StatsCard
Composant de carte de statistiques avec animations et indicateurs de tendance.

```tsx
import { StatsCard } from '../components/ui';

<StatsCard
  title="Total des votes"
  value="1,234"
  change={12.5}
  changeLabel="vs mois dernier"
  icon={<Users className="w-5 h-5" />}
  color="primary"
/>
```

**Props :**
- `title`: Titre de la statistique
- `value`: Valeur à afficher (string ou number)
- `change?`: Pourcentage de changement (optionnel)
- `changeLabel?`: Label pour le changement (optionnel)
- `icon?`: Icône à afficher (optionnel)
- `color?`: Couleur du thème ('primary', 'secondary', 'success', 'warning', 'error')
- `loading?`: État de chargement (optionnel)

### 2. FilmCard
Carte de film moderne avec animations et interactions.

```tsx
import { FilmCard } from '../components/ui';

<FilmCard
  id="film-123"
  title="Le Grand Voyage"
  director="Jean Dupont"
  duration={120}
  year={2024}
  country="France"
  synopsis="Un voyage extraordinaire..."
  posterUrl="/path/to/poster.jpg"
  rating={4.5}
  voteCount={156}
  onVote={(rating) => handleVote(rating)}
  onFavorite={() => handleFavorite()}
/>
```

**Fonctionnalités :**
- Animation au survol
- Système de notation intégré
- Bouton favoris
- Badges pour l'année et le pays
- Affichage des métadonnées

### 3. Dashboard
Tableau de bord complet avec statistiques et graphiques.

```tsx
import { Dashboard } from '../components/ui';

<Dashboard
  stats={{
    totalVotes: 1234,
    totalFilms: 25,
    averageRating: 4.2,
    activeSeances: 3,
    topFilm: {
      title: "Le Meilleur Film",
      rating: 4.8,
      votes: 89
    }
  }}
  loading={false}
/>
```

**Fonctionnalités :**
- 4 cartes de statistiques principales
- Affichage du film en tête
- Activité récente
- Barre de progression
- Support du thème sombre

### 4. Notification System
Système de notifications global avec différents types.

```tsx
import { useNotificationContext } from '../contexts/NotificationContext';

const { showSuccess, showError, showWarning, showInfo } = useNotificationContext();

showSuccess('Vote enregistré', 'Votre vote a été pris en compte');
showError('Erreur', 'Impossible de voter pour le moment');
```

**Types de notifications :**
- `success`: Succès (vert)
- `error`: Erreur (rouge)
- `warning`: Avertissement (jaune)
- `info`: Information (bleu)

## 🎭 Animations et Effets

### Classes CSS Utilitaires

```css
/* Animations */
.animate-fade-in          /* Apparition en fondu */
.animate-slide-up         /* Glissement vers le haut */
.animate-pulse-slow       /* Pulsation lente */
.animate-bounce-gentle    /* Rebond doux */
.animate-float            /* Flottement */
.animate-glow             /* Effet de lueur */

/* Cartes */
.card-hover               /* Carte avec effet hover */
.glass-card               /* Effet de verre */
.film-card-enhanced       /* Carte de film améliorée */

/* Badges */
.badge                    /* Badge de base */
.badge-primary            /* Badge primaire */
.badge-secondary          /* Badge secondaire */
.badge-success            /* Badge succès */
.badge-warning            /* Badge avertissement */
.badge-error              /* Badge erreur */

/* Boutons */
.btn-gradient             /* Bouton avec dégradé */
```

## 🌙 Support du Thème Sombre

Tous les composants supportent automatiquement le thème sombre via `prefers-color-scheme: dark`.

```css
@media (prefers-color-scheme: dark) {
  /* Styles automatiquement appliqués */
}
```

## 📱 Responsive Design

Les composants sont entièrement responsifs avec des breakpoints :
- Mobile : < 640px
- Tablet : 640px - 1024px
- Desktop : > 1024px

## 🎨 Personnalisation

### Variables CSS Personnalisées

```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #ea580c;
  --color-success: #059669;
  --color-warning: #d97706;
  --color-error: #dc2626;
  
  --border-radius-lg: 0.75rem;
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --transition-normal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Thème Personnalisé

```tsx
// Dans votre composant
const customTheme = {
  colors: {
    primary: '#your-color',
    secondary: '#your-color'
  }
};
```

## 🔧 Intégration

### 1. Importer les composants

```tsx
import { 
  StatsCard, 
  FilmCard, 
  Dashboard, 
  Notification, 
  NotificationContainer 
} from '../components/ui';
```

### 2. Configurer le contexte de notifications

```tsx
// Dans App.tsx
import { NotificationProvider } from './contexts/NotificationContext';

<NotificationProvider>
  {/* Votre application */}
</NotificationProvider>
```

### 3. Utiliser les hooks

```tsx
import { useNotificationContext } from '../contexts/NotificationContext';

const { showSuccess, showError } = useNotificationContext();
```

## 🚀 Bonnes Pratiques

### 1. Performance
- Utilisez `React.memo()` pour les composants qui ne changent pas souvent
- Lazy loading pour les composants lourds
- Optimisation des images avec `loading="lazy"`

### 2. Accessibilité
- Tous les composants incluent les attributs ARIA appropriés
- Support du clavier pour la navigation
- Contraste suffisant pour la lisibilité

### 3. UX
- Feedback visuel immédiat pour les actions
- États de chargement appropriés
- Messages d'erreur clairs et utiles

## 🐛 Dépannage

### Problèmes Courants

1. **Styles non appliqués**
   - Vérifiez que `index.css` est importé
   - Assurez-vous que Tailwind CSS est configuré

2. **Animations non fluides**
   - Vérifiez que les classes d'animation sont bien définies
   - Assurez-vous que le navigateur supporte les animations CSS

3. **Notifications non affichées**
   - Vérifiez que `NotificationProvider` entoure votre application
   - Assurez-vous que le hook est utilisé dans un composant enfant

## 📚 Ressources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)
- [React Hot Toast](https://react-hot-toast.com/docs)

---

*Ce guide est mis à jour régulièrement avec les nouvelles fonctionnalités ajoutées au projet.*
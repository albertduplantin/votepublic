# 🧪 Guide de Tests - VotePublic

## 🎯 **Objectif**

Ce guide explique comment utiliser et maintenir la suite de tests automatisés pour l'application VotePublic.

## 📋 **Types de Tests Implémentés**

### **1. Tests Unitaires**
- **Fonctions utilitaires** (`src/__tests__/utils/helpers.test.ts`)
- **Services** (`src/__tests__/services/authService.test.ts`)
- **Hooks personnalisés** (`src/__tests__/hooks/useFilms.test.ts`)

### **2. Tests de Composants**
- **Composants UI** (`src/__tests__/components/PrivateRoute.test.tsx`)
- **Gestion d'erreurs** (`src/__tests__/utils/errorHandler.test.ts`)

### **3. Tests d'Intégration**
- **Flux d'authentification** (`src/__tests__/integration/authFlow.test.tsx`)

## 🚀 **Commandes de Test**

### **Tests de Base**
```bash
# Lancer tous les tests
npm test

# Lancer les tests en mode watch (développement)
npm run test:watch

# Lancer les tests avec couverture
npm run test:coverage

# Lancer les tests en mode CI (sans watch)
npm run test:ci
```

### **Tests Spécifiques**
```bash
# Tester un fichier spécifique
npm test -- helpers.test.ts

# Tester un dossier spécifique
npm test -- utils/

# Tester avec un pattern
npm test -- --testNamePattern="auth"
```

## 📊 **Couverture de Code**

### **Seuils Minimum**
- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Statements** : 70%

### **Générer un Rapport**
```bash
npm run test:coverage
```

Le rapport sera généré dans `coverage/lcov-report/index.html`

## 🏗️ **Architecture des Tests**

### **Structure des Dossiers**
```
src/
├── __tests__/
│   ├── components/          # Tests des composants
│   ├── hooks/              # Tests des hooks
│   ├── integration/        # Tests d'intégration
│   ├── services/           # Tests des services
│   └── utils/              # Tests des utilitaires
├── __mocks__/              # Mocks globaux
└── setupTests.ts           # Configuration des tests
```

### **Conventions de Nommage**
- **Fichiers de test** : `*.test.ts` ou `*.test.tsx`
- **Fichiers de mock** : `fileMock.js`
- **Dossiers de test** : `__tests__`

## 🔧 **Configuration**

### **Jest Configuration** (`jest.config.js`)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### **Setup des Tests** (`src/setupTests.ts`)
- Configuration des mocks globaux
- Setup de l'environnement de test
- Configuration des utilitaires de test

## 🎭 **Mocks et Stubs**

### **Mocks Firebase**
```typescript
jest.mock('./services/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: jest.fn(),
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
  },
}));
```

### **Mocks React Router**
```typescript
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/', state: null }),
}));
```

### **Mocks Toast Notifications**
```typescript
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
```

## 📝 **Écriture de Tests**

### **Structure d'un Test**
```typescript
describe('NomDuComposant', () => {
  beforeEach(() => {
    // Setup avant chaque test
    jest.clearAllMocks();
  });

  describe('Fonctionnalité Spécifique', () => {
    it('should do something when condition is met', () => {
      // Arrange
      const props = { /* props */ };
      
      // Act
      render(<MonComposant {...props} />);
      
      // Assert
      expect(screen.getByText('Expected text')).toBeInTheDocument();
    });
  });
});
```

### **Tests de Composants**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('MonComposant', () => {
  it('should render correctly', () => {
    render(<MonComposant />);
    expect(screen.getByText('Titre')).toBeInTheDocument();
  });

  it('should handle user interactions', () => {
    render(<MonComposant />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

### **Tests de Services**
```typescript
import * as service from '../services/monService';

jest.mock('../services/monService');
const mockService = service as jest.Mocked<typeof service>;

describe('MonService', () => {
  it('should call API correctly', async () => {
    mockService.maFonction.mockResolvedValue('result');
    
    const result = await maFonction();
    
    expect(mockService.maFonction).toHaveBeenCalledWith('param');
    expect(result).toBe('result');
  });
});
```

### **Tests de Hooks**
```typescript
import { renderHook, act } from '@testing-library/react';

describe('useMonHook', () => {
  it('should return correct state', () => {
    const { result } = renderHook(() => useMonHook());
    
    expect(result.current.value).toBe('initial');
  });

  it('should update state correctly', () => {
    const { result } = renderHook(() => useMonHook());
    
    act(() => {
      result.current.updateValue('new');
    });
    
    expect(result.current.value).toBe('new');
  });
});
```

## 🧪 **Tests d'Intégration**

### **Flux Complets**
```typescript
describe('Auth Flow Integration', () => {
  it('should handle complete login flow', async () => {
    // Setup
    mockAuthService.loginWithEmail.mockResolvedValue(mockUser);
    
    // Render
    renderWithProviders(<LoginPage />);
    
    // Interact
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    // Assert
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
```

## 🔍 **Debugging des Tests**

### **Mode Debug**
```bash
# Lancer les tests en mode debug
npm test -- --verbose --no-coverage

# Tester un seul fichier
npm test -- --testPathPattern="helpers.test.ts"
```

### **Logs de Debug**
```typescript
// Dans les tests
console.log('Debug info:', someVariable);

// Vérifier les appels de mocks
expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
```

### **Tests Interactifs**
```bash
# Mode watch avec interface
npm run test:watch

# Pause sur échec
npm test -- --bail
```

## 📈 **Métriques de Qualité**

### **Indicateurs Clés**
- **Couverture de code** : > 70%
- **Temps d'exécution** : < 30 secondes
- **Tests qui passent** : 100%
- **Tests de régression** : Automatisés

### **Rapports de Qualité**
```bash
# Générer un rapport complet
npm run test:coverage

# Vérifier les seuils
npm run test:ci
```

## 🚨 **Dépannage**

### **Erreurs Courantes**

#### **1. Erreurs de Mock**
```bash
# Erreur : Cannot find module
# Solution : Vérifier les chemins dans jest.config.js
```

#### **2. Erreurs de TypeScript**
```bash
# Erreur : Type 'X' is not assignable to type 'Y'
# Solution : Utiliser des types appropriés dans les mocks
```

#### **3. Erreurs de Timing**
```bash
# Erreur : Async operations not awaited
# Solution : Utiliser waitFor() pour les opérations asynchrones
```

### **Solutions**

#### **Mock de Modules ES6**
```typescript
jest.mock('module-name', () => ({
  __esModule: true,
  default: jest.fn(),
  namedExport: jest.fn(),
}));
```

#### **Mock de Fonctions Async**
```typescript
const mockAsyncFunction = jest.fn().mockResolvedValue('result');
// ou
const mockAsyncFunction = jest.fn().mockRejectedValue(new Error('error'));
```

#### **Mock de Composants**
```typescript
jest.mock('../components/MonComposant', () => ({
  MonComposant: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-component">{children}</div>
  ),
}));
```

## 🔄 **Maintenance**

### **Mise à Jour des Tests**
1. **Ajouter des tests** pour les nouvelles fonctionnalités
2. **Mettre à jour les mocks** quand les APIs changent
3. **Refactorer les tests** pour améliorer la lisibilité
4. **Supprimer les tests obsolètes**

### **Revue de Code**
- [ ] Tous les tests passent
- [ ] Couverture suffisante
- [ ] Tests lisibles et maintenables
- [ ] Mocks appropriés
- [ ] Pas de tests redondants

## 🎯 **Bonnes Pratiques**

### **✅ À Faire**
- Écrire des tests pour chaque nouvelle fonctionnalité
- Utiliser des noms de tests descriptifs
- Tester les cas d'erreur
- Maintenir une couverture élevée
- Utiliser des mocks appropriés

### **❌ À Éviter**
- Tests trop complexes
- Mocks inutiles
- Tests qui dépendent d'autres tests
- Tests qui ne testent rien
- Tests qui cassent facilement

## 📚 **Ressources**

### **Documentation**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Events](https://testing-library.com/docs/user-event/intro/)

### **Outils**
- **Jest** : Framework de test
- **React Testing Library** : Utilitaires de test React
- **@testing-library/user-event** : Simulation d'événements utilisateur
- **@testing-library/jest-dom** : Matchers DOM pour Jest

---

**🎉 Votre suite de tests est maintenant prête ! Utilisez ces tests pour maintenir la qualité et la fiabilité de votre application VotePublic.**
module.exports = {
  // Environnement de test
  testEnvironment: 'jsdom',
  
  // Racines des tests
  roots: ['<rootDir>/src'],
  
  // Extensions de fichiers à traiter
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Transformations
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  
  // Configuration TypeScript
  preset: 'ts-jest',
  
  // Setup des tests
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  
  // Modules à mocker
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/src/__mocks__/fileMock.js',
  },
  
  // Collecte de couverture
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/setupTests.ts',
  ],
  
  // Seuil de couverture
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Répertoires à ignorer
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
  
  // Timeout des tests
  testTimeout: 10000,
  
  // Verbosité
  verbose: true,
  
  // Cache
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // Configuration TypeScript pour Jest
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};
module.exports = {
  // Preset pour TypeScript
  preset: 'ts-jest',
  
  // Environnement de test
  testEnvironment: 'node',
  
  // Répertoires des tests
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,js}',
    '<rootDir>/src/**/*.{test,spec}.{ts,js}'
  ],
  
  // Extensions de fichiers à traiter
  moduleFileExtensions: ['ts', 'js', 'json'],
  
  // Transformation des fichiers (nouvelle syntaxe)
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  
  // Fichiers à ignorer lors de la transformation
  transformIgnorePatterns: [
    'node_modules/(?!(supertest)/)'
  ],
  
  // Configuration de la couverture de code
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,js}',
    '!src/**/*.spec.{ts,js}',
    '!src/types/**',
  ],
  
  // Répertoire de sortie pour la couverture
  coverageDirectory: 'coverage',
  
  // Formats de rapport de couverture
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Seuils de couverture (ajustés pour le moment)
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  },
  
  // Variables d'environnement pour les tests
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  
  // Timeout pour les tests
  testTimeout: 10000,
  
  // Affichage détaillé
  verbose: true,
};

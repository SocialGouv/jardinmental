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
  
  // Variables d'environnement pour les tests
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  
  // Timeout pour les tests
  testTimeout: 10000,
  
  // Affichage détaillé
  verbose: true,
};

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import Export from '../../src/scenes/export/export';
import { DiaryDataContext } from '../../src/context/diaryData';
import { DiaryNotesContext } from '../../src/context/diaryNotes';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import logEvents from '../../src/services/logEvents';

// Mock seulement les modules Expo (APIs natives)
jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  moveAsync: jest.fn(),
}));

// Mock des services externes pour éviter les effets de bord
jest.mock('../../src/services/logEvents', () => ({
  logDataExport: jest.fn(),
}));

describe('Export Component', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  const mockDiaryData = {};
  const mockDiaryNotes = {};

  const renderWithContext = (component) => {
    return render(
      <DiaryDataContext.Provider value={[mockDiaryData, jest.fn()]}>
        <DiaryNotesContext.Provider value={[mockDiaryNotes, jest.fn()]}>
          {component}
        </DiaryNotesContext.Provider>
      </DiaryDataContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render correctly with main UI elements', () => {
    renderWithContext(<Export navigation={mockNavigation} />);

    // Vérifier que le titre principal est présent
    expect(screen.getByText('Je génère un fichier avec mes données des 30 derniers jours.')).toBeTruthy();
  });

  test('should render input field with placeholder', () => {
    renderWithContext(<Export navigation={mockNavigation} />);

    // Vérifier que le champ de saisie est présent
    expect(screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...')).toBeTruthy();
  });

  test('should render generate button', () => {
    renderWithContext(<Export navigation={mockNavigation} />);

    // Vérifier que le bouton de génération est présent
    expect(screen.getByText('Générer un fichier')).toBeTruthy();
  });

  test('should render optional label', () => {
    renderWithContext(<Export navigation={mockNavigation} />);

    // Vérifier que le texte optionnel est présent
    expect(screen.getByText(/Optionnel/)).toBeTruthy();
  });

  // Tests pour l'action d'input
  describe('Input Action Tests', () => {
    test('should update input value when user types', () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      
      // Simuler la saisie de texte
      fireEvent.changeText(input, 'Mon rapport janvier 2025');
      
      // Vérifier que la valeur a été mise à jour
      expect(input.props.value).toBe('Mon rapport janvier 2025');
    });

    test('should handle empty input value', () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      
      // Vérifier que l'input est vide au départ
      expect(input.props.value).toBe('');
      
      // Saisir du texte puis le vider
      fireEvent.changeText(input, 'Test');
      fireEvent.changeText(input, '');
      
      expect(input.props.value).toBe('');
    });

    test('should handle special characters in input', () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      
      // Tester avec des caractères spéciaux
      fireEvent.changeText(input, 'Rapport été 2024 - données importantes!');
      
      expect(input.props.value).toBe('Rapport été 2024 - données importantes!');
    });
  });

  // Tests pour l'action onPress
  describe('onPress Action Tests', () => {
    beforeEach(() => {
      // Configuration des mocks pour les tests onPress
      (Print.printToFileAsync as jest.Mock).mockResolvedValue({
        uri: '/path/to/generated/file.pdf'
      });
      (FileSystem.moveAsync as jest.Mock).mockResolvedValue(undefined);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
    });

    test('should call printToFile function when generate button is pressed', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const generateButton = screen.getByText('Générer un fichier');
      
      // Simuler le clic sur le bouton
      fireEvent.press(generateButton);
      
      // Vérifier que logDataExport est appelé
      expect(logEvents.logDataExport).toHaveBeenCalledTimes(1);
      
      // Attendre que printToFileAsync soit appelé
      await waitFor(() => {
        expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
      });
    });

    test('should show loading state when button is pressed', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const generateButton = screen.getByText('Générer un fichier');
      
      // Simuler le clic
      fireEvent.press(generateButton);
      
      // Vérifier que le texte de chargement apparaît
      await waitFor(() => {
        expect(screen.getByText('Génération en cours...')).toBeTruthy();
      });
    });

    test('should call shareAsync after file generation', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const generateButton = screen.getByText('Générer un fichier');
      
      fireEvent.press(generateButton);
      
      await waitFor(() => {
        expect(Sharing.shareAsync).toHaveBeenCalledWith(
          '/path/to/generated/file.pdf',
          { UTI: '.pdf', mimeType: 'application/pdf' }
        );
      });
    });

    test('should handle error during file generation', async () => {
      // Mock une erreur
      (Print.printToFileAsync as jest.Mock).mockRejectedValue(new Error('Generation failed'));
      
      // Mock console.log pour éviter les logs d'erreur dans les tests
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const generateButton = screen.getByText('Générer un fichier');
      
      fireEvent.press(generateButton);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
      });
      
      consoleSpy.mockRestore();
    });
  });

  // Tests pour la sauvegarde avec nom personnalisé
  describe('File Saving with Custom Name Tests', () => {
    beforeEach(() => {
      (Print.printToFileAsync as jest.Mock).mockResolvedValue({
        uri: '/path/to/generated/file.pdf'
      });
      (FileSystem.moveAsync as jest.Mock).mockResolvedValue(undefined);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
    });

    test('should save file with custom name when input is provided', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      const generateButton = screen.getByText('Générer un fichier');
      
      // Saisir un nom personnalisé
      fireEvent.changeText(input, 'Mon rapport personnalisé');
      
      // Générer le fichier
      fireEvent.press(generateButton);
      
      await waitFor(() => {
        expect(FileSystem.moveAsync).toHaveBeenCalledWith({
          from: '/path/to/generated/file.pdf',
          to: '/path/to/generated/Mon rapport personnalisé.pdf'
        });
      });
    });

    test('should share file with custom name', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      const generateButton = screen.getByText('Générer un fichier');
      
      // Saisir un nom personnalisé
      fireEvent.changeText(input, 'Rapport janvier 2025');
      
      // Générer le fichier
      fireEvent.press(generateButton);
      
      await waitFor(() => {
        expect(Sharing.shareAsync).toHaveBeenCalledWith(
          '/path/to/generated/Rapport janvier 2025.pdf',
          { UTI: '.pdf', mimeType: 'application/pdf' }
        );
      });
    });

    test('should use original filename when no custom name is provided', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const generateButton = screen.getByText('Générer un fichier');
      
      // Générer le fichier sans nom personnalisé
      fireEvent.press(generateButton);
      
      await waitFor(() => {
        // FileSystem.moveAsync ne devrait pas être appelé
        expect(FileSystem.moveAsync).not.toHaveBeenCalled();
        
        // Le fichier original devrait être partagé
        expect(Sharing.shareAsync).toHaveBeenCalledWith(
          '/path/to/generated/file.pdf',
          { UTI: '.pdf', mimeType: 'application/pdf' }
        );
      });
    });

    test('should handle special characters in custom filename', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      const generateButton = screen.getByText('Générer un fichier');
      
      // Saisir un nom avec caractères spéciaux
      fireEvent.changeText(input, 'Rapport été 2024 - données importantes!');
      
      fireEvent.press(generateButton);
      
      await waitFor(() => {
        expect(FileSystem.moveAsync).toHaveBeenCalledWith({
          from: '/path/to/generated/file.pdf',
          to: '/path/to/generated/Rapport été 2024 - données importantes!.pdf'
        });
      });
    });
  });

  // Test d'intégration complet
  describe('Integration Tests', () => {
    beforeEach(() => {
      (Print.printToFileAsync as jest.Mock).mockResolvedValue({
        uri: '/path/to/generated/file.pdf'
      });
      (FileSystem.moveAsync as jest.Mock).mockResolvedValue(undefined);
      (Sharing.shareAsync as jest.Mock).mockResolvedValue(undefined);
    });

    test('should complete full user flow: input name → press button → generate file with custom name', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      const generateButton = screen.getByText('Générer un fichier');
      
      // 1. Saisir un nom
      fireEvent.changeText(input, 'Test Integration');
      expect(input.props.value).toBe('Test Integration');
      
      // 2. Cliquer sur le bouton
      fireEvent.press(generateButton);
      
      // 3. Vérifier que toute la chaîne est exécutée
      await waitFor(() => {
        expect(logEvents.logDataExport).toHaveBeenCalledTimes(1);
        expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
        expect(FileSystem.moveAsync).toHaveBeenCalledWith({
          from: '/path/to/generated/file.pdf',
          to: '/path/to/generated/Test Integration.pdf'
        });
        expect(Sharing.shareAsync).toHaveBeenCalledWith(
          '/path/to/generated/Test Integration.pdf',
          { UTI: '.pdf', mimeType: 'application/pdf' }
        );
      });
    });

    test('should call logDataExport when generating file', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const generateButton = screen.getByText('Générer un fichier');
      
      fireEvent.press(generateButton);
      
      // Vérifier que l'événement de log est appelé
      expect(logEvents.logDataExport).toHaveBeenCalledTimes(1);
      
      await waitFor(() => {
        expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
      });
    });
  });
});

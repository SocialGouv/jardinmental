import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import Export from '../../src/scenes/export/export';
import { DiaryDataContext } from '../../src/context/diaryData';
import { DiaryNotesContext } from '../../src/context/diaryNotes';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import logEvents from '../../src/services/logEvents';

// Only lock Expo module (Native APIs)
jest.mock('expo-print', () => ({
  printToFileAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  moveAsync: jest.fn(),
}));

// Mock matomo logging
jest.mock('../../src/services/logEvents', () => ({
  logDataExport: jest.fn(),
}));

describe('Export Component', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  // Realistic mock data based on actual application structure
  const mockDiaryData = {
    "2025-01-01": {
      MOOD: { value: 4, userComment: "Feeling good today" },
      ANXIETY: { value: 2, userComment: "Mild anxiety in the morning" },
      SLEEP: 3,
      NOTES: "Had a productive day at work",
      POSOLOGY: [
        {
          id: "Lamictal (Lamotrigine)",
          name1: "Lamictal",
          name2: "Lamotrigine",
          value: "25 mg",
          values: ["12.5 mg", "25 mg", "50 mg", "100 mg"]
        }
      ]
    },
    "2025-01-02": {
      MOOD: { value: 3, userComment: "" },
      ANXIETY: { value: 4, userComment: "High anxiety during meeting" },
      SLEEP: 2,
      NOTES: "",
      POSOLOGY: [
        {
          id: "Lamictal (Lamotrigine)",
          name1: "Lamictal",
          name2: "Lamotrigine",
          value: "25 mg",
          values: ["12.5 mg", "25 mg", "50 mg", "100 mg"]
        },
        {
          id: "Mélatonine",
          name1: "Mélatonine",
          value: "10 mg",
          values: ["10 mg", "25 mg", "50 mg"]
        }
      ]
    },
    "2025-01-03": {
      MOOD: { value: 5, userComment: "Excellent mood!" },
      ANXIETY: { value: 1, userComment: "Very calm" },
      SLEEP: 4,
      NOTES: "Great day with family",
      becks: {
        "beck1": {
          date: "2025-01-03",
          time: "14:30",
          where: "At home",
          who: ["Family", "Friends"],
          what: "Family gathering for lunch",
          mainEmotion: "Joy",
          mainEmotionIntensity: 8,
          otherEmotions: ["Gratitude", "Love"],
          physicalSensations: ["Warmth", "Relaxation"],
          thoughtsBeforeMainEmotion: "This is wonderful",
          trustInThoughsThen: 9,
          memories: "Previous happy family moments",
          actions: "Enjoyed the moment, took photos",
          consequencesForYou: "Felt very happy and connected",
          consequencesForRelatives: "Everyone seemed to enjoy",
          argumentPros: "Family time is precious",
          argumentCons: "None really",
          nuancedThoughts: "Family time brings me joy and connection",
          trustInThoughsNow: 9,
          mainEmotionIntensityNuanced: 8
        }
      }
    },
    "2025-01-04": null, // Empty day
    "2025-01-05": {
      MOOD: { value: 2, userComment: "Difficult day" },
      ANXIETY: { value: 5, userComment: "Very anxious" },
      SLEEP: 1,
      NOTES: "Struggled with work stress",
      POSOLOGY: [
        {
          id: "Imovane (Zopiclone)",
          name1: "Imovane",
          name2: "Zopiclone",
          values: ["3.75 mg", "7.5 mg"],
          value: "7.5 mg"
        }
      ]
    },
    "2025-01-06": {
      MOOD: { value: 3, userComment: "Getting better" },
      ANXIETY: { value: 3, userComment: "Manageable anxiety" },
      SLEEP: 3,
      NOTES: { notesEvents: "Therapy session was helpful" }
    }
  };

  const mockDiaryNotes = {
    "2025-01-01": {
      values: [
        { id: "note1", value: "Morning reflection: feeling optimistic about the new year" },
        { id: "note2", value: "Evening note: meditation helped with relaxation" }
      ]
    },
    "2025-01-02": {
      values: [
        { id: "note3", value: "Work meeting was stressful but manageable" }
      ]
    },
    "2025-01-03": {
      values: [
        { id: "note4", value: "Family time was wonderful" },
        { id: "note5", value: "Feeling grateful for support system" },
        { id: "note6", value: "Exercise helped boost mood" }
      ]
    },
    "2025-01-05": {
      values: [
        { id: "note7", value: "Difficult day but trying to stay positive" },
        { id: "note8", value: "Need to practice self-care more" }
      ]
    },
    "2025-01-06": {
      values: [
        { id: "note9", value: "Therapy insights: working on coping strategies" }
      ]
    }
  };

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
    expect(screen.getByText('Je génère un fichier avec mes données des 30 derniers jours.')).toBeTruthy();
  });

  test('should render input field with placeholder', () => {
    renderWithContext(<Export navigation={mockNavigation} />);
    expect(screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...')).toBeTruthy();
  });

  test('should render generate button', () => {
    renderWithContext(<Export navigation={mockNavigation} />);
    expect(screen.getByText('Générer un fichier')).toBeTruthy();
  });

  test('should render optional label', () => {
    renderWithContext(<Export navigation={mockNavigation} />);
    expect(screen.getByText(/optionnel/)).toBeTruthy();
  });

  describe('Input Action Tests', () => {
    test('should update input value when user types', () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      fireEvent.changeText(input, 'Mon rapport janvier 2025');
      
      expect(input.props.value).toBe('Mon rapport janvier 2025');
    });

    test('should handle empty input value', () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      
      expect(input.props.value).toBe('');
      
      fireEvent.changeText(input, 'Test');
      fireEvent.changeText(input, '');
      
      expect(input.props.value).toBe('');
    });

    test('should handle special characters in input', () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const input = screen.getByPlaceholderText('Ex: Arthur M. décembre 2020, ...');
      
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
      
      fireEvent.press(generateButton);
      
      expect(logEvents.logDataExport).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
      });
    });

    test('should show loading state when button is pressed', async () => {
      renderWithContext(<Export navigation={mockNavigation} />);
      
      const generateButton = screen.getByText('Générer un fichier');
      
      fireEvent.press(generateButton);
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
      (Print.printToFileAsync as jest.Mock).mockRejectedValue(new Error('Generation failed'));
      
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
      
      fireEvent.changeText(input, 'Mon rapport personnalisé');
      
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
      
      fireEvent.changeText(input, 'Rapport janvier 2025');
      
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
      
      fireEvent.press(generateButton);
      
      await waitFor(() => {
        expect(FileSystem.moveAsync).not.toHaveBeenCalled();
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
      
      // 1. Add a name
      fireEvent.changeText(input, 'Test Integration');
      expect(input.props.value).toBe('Test Integration');
      
      // 2. Click on the button
      fireEvent.press(generateButton);
      
      // 3. Verify that everything is executed
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
      
      expect(logEvents.logDataExport).toHaveBeenCalledTimes(1);
      
      await waitFor(() => {
        expect(Print.printToFileAsync).toHaveBeenCalledTimes(1);
      });
    });
  });
});

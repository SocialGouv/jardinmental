import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Export from '../../src/scenes/export/export';
import { DiaryDataContext } from '../../src/context/diaryData';
import { DiaryNotesContext } from '../../src/context/diaryNotes';

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
});

// Mock external dependencies first, before any imports
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: "LinearGradient",
}));

jest.mock("expo-file-system", () => ({
  documentDirectory: "file://test/",
  writeAsStringAsync: jest.fn(),
  readAsStringAsync: jest.fn(),
  EncodingType: {
    UTF8: "utf8",
  },
}));

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock("expo-sharing", () => ({
  shareAsync: jest.fn(),
}));

// Mock matomo logging
jest.mock("../../src/services/logEvents", () => ({
  logDataExportAsBackUp: jest.fn(),
  logDataImport: jest.fn(),
}));

// Mock JMButton
jest.mock("@/components/JMButton", () => {
  const { TouchableOpacity, Text } = require("react-native");
  return function JMButton({ title, onPress, disabled, ...props }: any) {
    return (
      <TouchableOpacity onPress={onPress} disabled={disabled} {...props}>
        <Text>{title}</Text>
      </TouchableOpacity>
    );
  };
});

// Mock AnimatedHeaderScrollScreen
jest.mock("../../src/scenes/survey-v2/AnimatedHeaderScrollScreen", () => ({
  AnimatedHeaderScrollScreen: ({ children, title }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View>
        <Text>{title}</Text>
        {children}
      </View>
    );
  },
}));

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";

// Mock Alert.alert globally
const originalAlert = Alert.alert;
Alert.alert = jest.fn();
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";

import DataExportImport from "../../src/scenes/data-export-import/DataExportImport";
import { DiaryDataContext } from "../../src/context/diaryData";
import { DiaryData } from "../../src/entities/DiaryData";
import logEvents from "../../src/services/logEvents";

const mockFileSystem = FileSystem as jest.Mocked<typeof FileSystem>;
const mockDocumentPicker = DocumentPicker as jest.Mocked<typeof DocumentPicker>;
const mockSharing = Sharing as jest.Mocked<typeof Sharing>;
const mockLogEvents = logEvents as jest.Mocked<typeof logEvents>;

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Sample diary data for testing
const sampleDiaryData: DiaryData = {
  "2024-01-01": {
    MOOD: {
      value: 3,
      userComment: "Feeling anxious today",
    },
    ANXIETY: {
      value: 4,
      userComment: "High anxiety levels",
    },
    NOTES: "Journée difficile",
    POSOLOGY: [
      {
        id: "med1",
        name1: "Lamictal",
        name2: "Lamotrigine",
        value: "25mg",
        values: ["12.5mg", "25mg", "50mg"],
      },
    ],
  },
  "2024-01-02": {
    MOOD: {
      value: 4,
      userComment: "Better mood today",
    },
    SLEEP: {
      value: 3,
    },
    NOTES: {
      notesEvents: "Had a good therapy session",
    },
  },
};

const additionalDiaryData: DiaryData = {
  "2024-01-03": {
    MOOD: {
      value: 5,
      userComment: "Excellent mood",
    },
    ANXIETY: {
      value: 2,
      userComment: "Much calmer",
    },
    NOTES: "Great day with family",
    becks: {
      beck1: {
        date: "2024-01-03",
        time: "14:30",
        where: "At home",
        who: ["Family"],
        what: "Family gathering",
        mainEmotion: "Joy",
        mainEmotionIntensity: 8,
        otherEmotions: ["Gratitude"],
        physicalSensations: ["Warmth"],
        thoughtsBeforeMainEmotion: "This is wonderful",
        trustInThoughsThen: 9,
        memories: "Previous happy moments",
        actions: "Enjoyed the moment",
        consequencesForYou: "Felt very happy",
        consequencesForRelatives: "Everyone enjoyed",
        argumentPros: "Family time is precious",
        argumentCons: "None",
        nuancedThoughts: "Family brings joy",
        trustInThoughsNow: 9,
        mainEmotionIntensityNuanced: 8,
      },
    },
  },
};

describe("DataExportImport", () => {
  let mockContextValue: any;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockContextValue = [
      sampleDiaryData,
      jest.fn(), // addNewEntryToDiaryData
      jest.fn(), // deleteDiaryData
      jest.fn(), // importDiaryData
    ];

    // Setup spy for Alert.alert
    alertSpy = jest.spyOn(Alert, "alert").mockImplementation((title, message, buttons) => {
      // Simulate user pressing the first button (usually OK or Cancel)
      if (buttons && buttons.length > 0 && buttons[0].onPress) {
        buttons[0].onPress();
      }
    });
  });

  afterEach(() => {
    alertSpy.mockRestore();
    // Clean up any pending timers or async operations
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderComponent = () => {
    return render(
      <DiaryDataContext.Provider value={mockContextValue}>
        <DataExportImport navigation={mockNavigation} />
      </DiaryDataContext.Provider>
    );
  };

  describe("UI Rendering", () => {
    it("should render all main UI elements", () => {
      const { getByText } = renderComponent();

      expect(getByText("Exporter et enregistrer mes données")).toBeTruthy();
      expect(getByText("Exporter mes données")).toBeTruthy();
      expect(getByText("Importer des données")).toBeTruthy();
    });

    it("should display information section", () => {
      const { getByText } = renderComponent();

      expect(getByText("Pourquoi sauvegarder mes données ?")).toBeTruthy();
      expect(getByText(/Afin de garantir la confidentialité de vos données/)).toBeTruthy();
    });

    it("should display import instructions", () => {
      const { getByText } = renderComponent();

      expect(getByText("Comment importer mes données sur un nouvel appareil ?")).toBeTruthy();
      expect(getByText(/Cliquer sur le bouton/)).toBeTruthy();
    });
  });

  describe("Export functionality", () => {
    it("should export diary data successfully", async () => {
      mockFileSystem.writeAsStringAsync.mockResolvedValue();
      mockSharing.shareAsync.mockResolvedValue();

      const { getByText } = renderComponent();
      const exportButton = getByText("Exporter mes données");

      fireEvent.press(exportButton);

      await waitFor(
        () => {
          expect(mockFileSystem.writeAsStringAsync).toHaveBeenCalledWith(
            expect.stringContaining("jardin-mental-export-"),
            expect.stringContaining('"data":'),
            { encoding: FileSystem.EncodingType.UTF8 }
          );
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(mockSharing.shareAsync).toHaveBeenCalledWith(expect.stringContaining("jardin-mental-export-"), {
            UTI: ".json",
            mimeType: "application/json",
            dialogTitle: "Exporter mes données Jardin Mental",
          });
        },
        { timeout: 3000 }
      );

      await waitFor(
        () => {
          expect(alertSpy).toHaveBeenCalledWith("Export réussi", "Vos données ont été exportées avec succès !");
        },
        { timeout: 3000 }
      );
    });

    it("should handle export errors gracefully", async () => {
      mockFileSystem.writeAsStringAsync.mockRejectedValue(new Error("Write failed"));

      const { getByText } = renderComponent();
      const exportButton = getByText("Exporter mes données");

      fireEvent.press(exportButton);

      await waitFor(
        () => {
          expect(alertSpy).toHaveBeenCalledWith("Erreur", "Une erreur s'est produite lors de l'export de vos données.");
        },
        { timeout: 3000 }
      );
    });

    it("should show loading state during export", async () => {
      mockFileSystem.writeAsStringAsync.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
      mockSharing.shareAsync.mockResolvedValue();

      const { getByText } = renderComponent();
      const exportButton = getByText("Exporter mes données");

      fireEvent.press(exportButton);

      await waitFor(
        () => {
          expect(getByText("Export en cours...")).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    it("should export with correct file structure", async () => {
      mockFileSystem.writeAsStringAsync.mockResolvedValue();
      mockSharing.shareAsync.mockResolvedValue();

      const { getByText } = renderComponent();
      const exportButton = getByText("Exporter mes données");

      fireEvent.press(exportButton);

      await waitFor(
        () => {
          expect(mockFileSystem.writeAsStringAsync).toHaveBeenCalledWith(
            expect.any(String),
            expect.stringMatching(/"exportDate".*"appVersion".*"data"/s),
            { encoding: FileSystem.EncodingType.UTF8 }
          );
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Import functionality - File Selection", () => {
    beforeEach(() => {
      mockDocumentPicker.getDocumentAsync.mockResolvedValue({
        canceled: false,
        assets: [
          {
            uri: "file://test/import.json",
            name: "import.json",
          },
        ],
      } as any);
    });

    it("should handle file selection cancellation", async () => {
      mockDocumentPicker.getDocumentAsync.mockResolvedValue({
        canceled: true,
      } as any);

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(
        () => {
          expect(mockDocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
            type: "application/json",
            copyToCacheDirectory: true,
          });
        },
        { timeout: 3000 }
      );

      expect(mockFileSystem.readAsStringAsync).not.toHaveBeenCalled();
      expect(mockContextValue[3]).not.toHaveBeenCalled();
    });

    it("should handle document picker errors", async () => {
      mockDocumentPicker.getDocumentAsync.mockRejectedValue(new Error("Picker failed"));

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(
        () => {
          expect(alertSpy).toHaveBeenCalledWith("Erreur", "Une erreur s'est produite lors de l'import de vos données.");
        },
        { timeout: 3000 }
      );
    });
  });

  describe("Import functionality - Data Validation", () => {
    beforeEach(() => {
      mockDocumentPicker.getDocumentAsync.mockResolvedValue({
        canceled: false,
        assets: [
          {
            uri: "file://test/import.json",
            name: "import.json",
          },
        ],
      } as any);
    });

    it("should handle invalid JSON data", async () => {
      mockFileSystem.readAsStringAsync.mockResolvedValue("invalid json data");

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith("Erreur", "Le fichier sélectionné n'est pas un fichier d'export valide.");
      });

      expect(mockContextValue[3]).not.toHaveBeenCalled();
    });

    it("should handle missing data structure", async () => {
      const invalidData = JSON.stringify({ exportDate: "2024-01-01", appVersion: "test" });
      mockFileSystem.readAsStringAsync.mockResolvedValue(invalidData);

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith("Erreur", "Le fichier sélectionné ne contient pas de données valides.");
      });
    });

    it("should handle invalid data structure", async () => {
      const invalidData = JSON.stringify({ data: "not an object" });
      mockFileSystem.readAsStringAsync.mockResolvedValue(invalidData);

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith("Erreur", "Le fichier sélectionné ne contient pas de données valides.");
      });
    });

    it("should handle file reading errors", async () => {
      mockFileSystem.readAsStringAsync.mockRejectedValue(new Error("Read failed"));

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith("Erreur", "Une erreur s'est produite lors de l'import de vos données.");
      });
    });
  });

  describe("Import functionality - Merge Mode", () => {
    beforeEach(() => {
      mockDocumentPicker.getDocumentAsync.mockResolvedValue({
        canceled: false,
        assets: [
          {
            uri: "file://test/import.json",
            name: "import.json",
          },
        ],
      } as any);

      const validExportData = {
        exportDate: "2024-01-01T00:00:00.000Z",
        appVersion: "jardin-mental",
        data: additionalDiaryData,
      };
      mockFileSystem.readAsStringAsync.mockResolvedValue(JSON.stringify(validExportData));
    });

    it("should import data successfully", async () => {
      // Mock Alert to simulate user confirming the import
      alertSpy.mockImplementation((title, message, buttons) => {
        if (buttons && buttons.length > 1 && buttons[1].onPress) {
          buttons[1].onPress(); // Press "Importer" button
        }
      });

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(mockContextValue[3]).toHaveBeenCalledWith(additionalDiaryData, "merge");
      });
    });

    it("should show confirmation dialog for merge", async () => {
      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Confirmer l'import",
          "Cette action va fusionner avec vos données existantes. Êtes-vous sûr de vouloir continuer ?",
          expect.arrayContaining([expect.objectContaining({ text: "Annuler" }), expect.objectContaining({ text: "Importer" })])
        );
      });
    });

    it("should handle user canceling import confirmation", async () => {
      // Mock Alert to simulate user canceling
      alertSpy.mockImplementation((title, message, buttons) => {
        if (buttons && buttons.length > 0 && buttons[0].onPress) {
          buttons[0].onPress(); // Press "Annuler" button
        }
      });

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled();
      });

      // importDiaryData should not be called if user cancels
      expect(mockContextValue[3]).not.toHaveBeenCalled();
    });
  });

  describe("Import functionality - Success Flow", () => {
    beforeEach(() => {
      mockDocumentPicker.getDocumentAsync.mockResolvedValue({
        canceled: false,
        assets: [
          {
            uri: "file://test/import.json",
            name: "import.json",
          },
        ],
      } as any);

      const validExportData = {
        exportDate: "2024-01-01T00:00:00.000Z",
        appVersion: "jardin-mental",
        data: additionalDiaryData,
      };
      mockFileSystem.readAsStringAsync.mockResolvedValue(JSON.stringify(validExportData));
    });

    it("should show success message and navigate after successful import", async () => {
      // Mock Alert to simulate user interactions
      let alertCallCount = 0;
      alertSpy.mockImplementation((title, message, buttons) => {
        alertCallCount++;
        if (alertCallCount === 1 && buttons && buttons.length > 1 && buttons[1].onPress) {
          // First alert: confirmation dialog - press "Importer"
          buttons[1].onPress();
        } else if (alertCallCount === 2 && buttons && buttons.length > 0 && buttons[0].onPress) {
          // Second alert: success dialog - press "OK"
          buttons[0].onPress();
        }
      });

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Import réussi",
          "Vos données ont été importées avec succès !",
          expect.arrayContaining([expect.objectContaining({ text: "OK" })])
        );
      });

      await waitFor(() => {
        expect(mockNavigation.navigate).toHaveBeenCalledWith("tabs");
      });
    });

    it("should show loading state during import", async () => {
      mockContextValue[3].mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));

      // Mock Alert to simulate user confirming
      alertSpy.mockImplementation((title, message, buttons) => {
        if (buttons && buttons.length > 1 && buttons[1].onPress) {
          buttons[1].onPress();
        }
      });

      const { getByText } = renderComponent();
      const importButton = getByText("Importer des données");
      fireEvent.press(importButton);

      await waitFor(() => {
        expect(getByText("Import en cours...")).toBeTruthy();
      });
    });
  });
});

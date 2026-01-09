import React, { useContext, useState } from "react";
import { Alert, View, Text } from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { shareAsync } from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { colors } from "../../utils/colors";
import logEvents from "../../services/logEvents";
import JMButton from "@/components/JMButton";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import InfoIcon from "@assets/svg/icon/Info";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { DiaryDataContext } from "@/context/diaryData";
import { STORAGE_KEY_SURVEY_RESULTS } from "@/utils/constants";
import { Typography } from "@/components/Typography";

// Keys to exclude from export (device-specific and transient UI states)
const EXPORT_BLACKLIST = [
  "deviceId",
  "STORAGE_KEY_PUSH_NOTIFICATION_TOKEN",
  "STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR",
  "@Reminder",
  "ReminderStorageKey",
  "REMINDER_VERSION_OLDER_154",
  "REMINDER_VERSION_OLDER_193",
  "devMode",
  "hasVisitedResources",
  "@AT_LEAST_VIEW_ONE_TIME_HINT_FRISE",
  "STORAGE_LATEST_CHANGES_DISPLAYED",
  "STORAGE_KEY_MOTIVATIONAL_MESSAGE_INDEX",
  "STORAGE_KEY_MOTIVATIONAL_MESSAGE_SHUFFLED_ORDER",
  "STORE_KEY_NPS_DONE",
  "STORE_KEY_INITIAL_OPENING",
  "STORE_KEY_NPS_SCHEDULING_IN_PROGRESS",
  "STORAGE_KEY_VISIT_PRO_NPS",
  "STORAGE_KEY_NPS_PRO_CONTACT",
  "STORAGE_KEY_USER_ID",
  "STORAGE_KEY_NUMBER_OF_VISITS",
  "STORAGE_KEY_CHECKLIST_BANNER_STATE",
  "STORAGE_KEY_VIEWED_EXTERNAL_RESOURCES",
  "STORAGE_KEY_VIEWED_RESOURCES",
  "STORAGE_INFO_MODAL_DISMISSED",
];

const DataExportImport = ({ navigation }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [diaryData, _addNewEntryToDiaryData, _deleteDiaryData, importDiaryData] = useContext(DiaryDataContext);

  const exportData = async () => {
    try {
      setIsExporting(true);
      logEvents.logDataExportAsBackUp();

      // Get all AsyncStorage keys
      const allKeys = await AsyncStorage.getAllKeys();

      // Filter out blacklisted keys
      const keysToExport = allKeys.filter((key) => !EXPORT_BLACKLIST.includes(key));

      // Get all values for the keys to export
      const keyValuePairs = await AsyncStorage.multiGet(keysToExport);

      // Convert to object format
      const asyncStorageData: Record<string, string> = {};
      keyValuePairs.forEach(([key, value]) => {
        if (value !== null) {
          asyncStorageData[key] = value;
        }
      });

      // Create export data structure
      const exportDataObj = {
        exportDate: new Date().toISOString(),
        appVersion: "jardin-mental",
        dataFormat: "v1",
        data: asyncStorageData,
      };
      const jsonString = JSON.stringify(exportDataObj, null, 2);

      // Create temporary file
      const fileName = `jardin-mental-export-${new Date().toISOString().split("T")[0]}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Share the file
      await shareAsync(fileUri, {
        UTI: ".txt",
        mimeType: "text/plain",
        dialogTitle: "Exporter mes données Jardin Mental",
      });

      Alert.alert("Export réussi", "Vos données ont été exportées avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'export de vos données.");
    } finally {
      setIsExporting(false);
    }
  };

  const importData = async () => {
    try {
      setIsImporting(true);
      logEvents.logDataImport();

      // Select the file
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      // Read the file content
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Parse the JSON
      let importedData;
      try {
        importedData = JSON.parse(fileContent);
      } catch (parseError) {
        Alert.alert("Erreur", "Le fichier sélectionné n'est pas un fichier d'export valide.");
        setIsImporting(false);
        return;
      }

      // Validate data format
      if (importedData.dataFormat !== "v1") {
        Alert.alert("Erreur", "Le fichier sélectionné n'est pas au format attendu (v1).");
        setIsImporting(false);
        return;
      }

      // Validate data structure
      if (!importedData.data || typeof importedData.data !== "object") {
        Alert.alert("Erreur", "Le fichier sélectionné ne contient pas de données valides.");
        setIsImporting(false);
        return;
      }

      // Ask for confirmation before importing
      Alert.alert("Confirmer l'import", "Cette action va restaurer toutes vos données depuis la sauvegarde. Êtes-vous sûr de vouloir continuer ?", [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Importer",
          style: "destructive",
          onPress: async () => {
            try {
              // Restore all AsyncStorage keys from the imported data
              const entries = Object.entries(importedData.data).filter((key) => ![STORAGE_KEY_SURVEY_RESULTS].includes(key[0]));
              for (const [key, value] of entries) {
                if (typeof value === "string") {
                  await AsyncStorage.setItem(key, value);
                }
              }
              // import diaryData separately to merge the data with potential data in the phone
              const surveyResultsData = importedData.data[STORAGE_KEY_SURVEY_RESULTS];
              if (surveyResultsData) {
                const parsedSurveyResults = typeof surveyResultsData === "string" ? JSON.parse(surveyResultsData) : surveyResultsData;
                await importDiaryData(parsedSurveyResults, "merge");
              }
              Alert.alert("Import réussi", "Vos données ont été importées avec succès !", [
                {
                  text: "OK",
                  onPress: () => {
                    // Navigate to main screen
                    navigation.navigate("tabs");
                  },
                },
              ]);
            } catch (saveError) {
              console.error("Erreur lors de la sauvegarde:", saveError);
              Alert.alert("Erreur", "Une erreur s'est produite lors de la sauvegarde des données importées.");
            }
          },
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de l'import:", error);
      Alert.alert("Erreur", "Une erreur s'est produite lors de l'import de vos données.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <AnimatedHeaderScrollScreen
      title="Exporter et enregistrer mes données"
      navigation={navigation}
      handlePrevious={() => navigation.goBack()}
      showBottomButton={false}
      scrollViewBackground={colors.WHITE}
    >
      <View className="p-5">
        <View className="w-full mb-5 bg-cnam-cyan-50-lighten-90 rounded-2xl p-4">
          <View className="flex-row justify-center items-center">
            <View className="bg-white border border-cnam-primary-900 w-[32] h-[32] justify-center items-center rounded-full">
              <InfoIcon width={16} height={16} />
            </View>
            <Typography className={mergeClassNames(typography.textMdSemibold, "ml-2 text-cnam-primary-900")}>
              Pourquoi sauvegarder mes données ?
            </Typography>
          </View>
          <Typography className={mergeClassNames(typography.textMdMedium, "ml-2 text-cnam-primary-900")}>
            Afin de garantir la confidentialité de vos données, celles-ci sont uniquement stockées sur votre appareil. {"\n\n"}Si vous souhaitez
            changer d’appareil et conserver votre historique Jardin Mental vous devez sauvegarder vos données puis les importer sur votre nouvel
            appareil.
          </Typography>
        </View>
        <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 mt-4")}>
          Comment importer mes données sur un nouvel appareil ?
        </Typography>
        <View className="flex-col space-y-4 w-full justify-start items-start mt-4 mb-8">
          {[
            `Cliquer sur le bouton “Sauvegarder” ci-dessous`,
            `Enregistrer le fichier généré dans les fichiers de votre appareil`,
            `Sur votre nouvel appareil cliquer sur “Importer mon historique” (bouton ci-dessous)`,
            `Sélectionner le fichier de sauvegarde`,
          ].map((item, index) => (
            <View key={index} className="flex-row items-center justify-center">
              <View
                className="h-[32] w-[32] bg-white border-cnam-primary-900 rounded-full justify-center items-center mr-2"
                style={{ borderWidth: 1.5 }}
              >
                <Typography className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>{index + 1}</Typography>
              </View>

              <Typography className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 flex-1 text-left")}>{item}</Typography>
            </View>
          ))}
        </View>

        <View className="w-full">
          {isImporting ? (
            <JMButton title="Import en cours..." disabled className="mb-2" variant="outline" />
          ) : (
            <JMButton title="Importer des données" onPress={importData} variant="outline" className="mb-2" />
          )}
          {isExporting ? <JMButton title="Export en cours..." disabled /> : <JMButton title="Exporter mes données" onPress={exportData} />}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default DataExportImport;

import React, { useContext, useState } from "react";
import { Alert, View, TouchableOpacity, Text } from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { shareAsync } from "expo-sharing";

import { colors } from "../../utils/colors";
import logEvents from "../../services/logEvents";
import { DiaryDataContext } from "../../context/diaryData";
import JMButton from "../../components/JMButton";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import InfoIcon from "@assets/svg/icon/Info";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";

const DataExportImport = ({ navigation }) => {
  const [diaryData, _addNewEntryToDiaryData, _deleteDiaryData, importDiaryData] = useContext(DiaryDataContext);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importMode, setImportMode] = useState<"replace" | "merge">("replace");

  const exportData = async () => {
    try {
      setIsExporting(true);
      logEvents.logDataExportAsBackUp();

      // Créer le contenu du fichier avec toutes les données
      const exportData = {
        exportDate: new Date().toISOString(),
        appVersion: "jardin-mental",
        data: diaryData,
      };
      const jsonString = JSON.stringify(exportData, null, 2);

      // Créer le fichier temporaire
      const fileName = `jardin-mental-export-${new Date().toISOString().split("T")[0]}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Partager le fichier
      await shareAsync(fileUri, {
        UTI: ".json",
        mimeType: "application/json",
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

      // Sélectionner le fichier
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsImporting(false);
        return;
      }

      // Lire le contenu du fichier
      const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      // Parser le JSON
      let importedData;
      try {
        importedData = JSON.parse(fileContent);
      } catch (parseError) {
        Alert.alert("Erreur", "Le fichier sélectionné n'est pas un fichier d'export valide.");
        setIsImporting(false);
        return;
      }

      // Vérifier la structure des données
      if (!importedData.data || typeof importedData.data !== "object") {
        Alert.alert("Erreur", "Le fichier sélectionné ne contient pas de données valides.");
        setIsImporting(false);
        return;
      }

      // Demander confirmation avant d'importer
      const modeText = importMode === "replace" ? "remplacer toutes vos données actuelles" : "fusionner avec vos données existantes";
      Alert.alert(`Confirmer l'import`, `Cette action va ${modeText}. Êtes-vous sûr de vouloir continuer ?`, [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Importer",
          style: "destructive",
          onPress: async () => {
            try {
              // Utiliser la fonction du contexte pour importer
              await importDiaryData(importedData.data, importMode);

              Alert.alert("Import réussi", "Vos données ont été importées avec succès !", [
                {
                  text: "OK",
                  onPress: () => {
                    // Naviguer vers l'écran principal
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
            <Text className={mergeClassNames(typography.textMdSemibold, "ml-2 text-cnam-primary-900")}>Pourquoi sauvegarder mes données ?</Text>
          </View>
          <Text className={mergeClassNames(typography.textMdMedium, "ml-2 text-cnam-primary-900")}>
            Afin de garantir la confidentialité de vos données, celles-ci sont uniquement stockées sur votre appareil. {"\n\n"}Si vous souhaitez
            changer d’appareil et conserver votre historique Jardin Mental vous devez sauvegarder vos données puis les importer sur votre nouvel
            appareil.
          </Text>
        </View>
        <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900 mt-4")}>
          Comment importer mes données sur un nouvel appareil ?
        </Text>
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
                <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-primary-900")}>{index + 1}</Text>
              </View>

              <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-900 flex-1 text-left")}>{item}</Text>
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

          {/* <Text className="text-sm text-[#1B3B5E] text-center mb-5 leading-5">
            Sélectionnez un fichier d'export précédent pour restaurer vos données.
          </Text> */}

          {/* Options de mode d'import */}
          {/* <          <View className="my-5">
            <Text className="text-base font-bold text-[#1FC6D5] mb-3.5">Mode d'import :</Text>

            <TouchableOpacity className="flex-row items-start mb-4 px-2.5" onPress={() => setImportMode("replace")}>
              <View
                className={`w-5 h-5 rounded-full border-2 border-[#1FC6D5] items-center justify-center mr-3 mt-0.5 ${
                  importMode === "replace" ? "border-[#1FC6D5]" : ""
                }`}
              >
                {importMode === "replace" && <View className="w-2.5 h-2.5 rounded-full bg-[#1FC6D5]" />}
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#1FC6D5] mb-1">Remplacer toutes mes données</Text>
                <Text className="text-[13px] text-[#1B3B5E] leading-[18px]">
                  Efface toutes les données existantes et les remplace par celles du fichier
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-start mb-4 px-2.5" onPress={() => setImportMode("merge")}>
              <View
                className={`w-5 h-5 rounded-full border-2 border-[#1FC6D5] items-center justify-center mr-3 mt-0.5 ${
                  importMode === "merge" ? "border-[#1FC6D5]" : ""
                }`}
              >
                {importMode === "merge" && <View className="w-2.5 h-2.5 rounded-full bg-[#1FC6D5]" />}
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#1FC6D5] mb-1">Fusionner avec mes données</Text>
                <Text className="text-[13px] text-[#1B3B5E] leading-[18px]">Ajoute les nouvelles données en conservant les existantes</Text>
              </View>
            </TouchableOpacity>
          </View>> */}

          {/* <Text className="text-xs text-[#ff6b6b] text-center mb-5 italic">
            ⚠️{" "}
            {importMode === "replace"
              ? "Attention : Cette action remplacera toutes vos données actuelles."
              : "Les données existantes seront conservées et complétées par les nouvelles."}
          </Text> */}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default DataExportImport;

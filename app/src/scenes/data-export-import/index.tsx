import React, { useContext, useState } from "react";
import { StyleSheet, Alert, KeyboardAvoidingView, Platform, View, ScrollView, Keyboard, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { shareAsync } from "expo-sharing";

import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import logEvents from "../../services/logEvents";
import { DiaryDataContext } from "../../context/diaryData";
import Icon from "../../components/Icon";
import BackButton from "../../components/BackButton";
import JMButton from "../../components/JMButton";

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
      const fileName = `jardin-mental-export-${new Date().toISOString().split("T")[0]}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Partager le fichier
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

      // Sélectionner le fichier
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/plain",
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <BackButton onPress={navigation.goBack} />

          <Icon
            icon="ExportDataSvg"
            color="#d3d3e8"
            styleContainer={{
              marginTop: 0,
              marginBottom: 30,
            }}
            width={80}
            height={80}
            spin={false}
            onPress={() => {}}
          />

          <Text style={styles.title}>Export / Import de mes données</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exporter mes données</Text>
            <Text style={styles.description}>Téléchargez toutes vos données dans un fichier .txt que vous pourrez sauvegarder ou partager.</Text>
            {isExporting ? <JMButton title="Export en cours..." disabled /> : <JMButton title="Exporter mes données" onPress={exportData} />}
          </View>

          <View style={styles.separator} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Importer mes données</Text>
            <Text style={styles.description}>Sélectionnez un fichier d'export précédent pour restaurer vos données.</Text>

            {/* Options de mode d'import */}
            <View style={styles.radioGroup}>
              <Text style={styles.radioGroupTitle}>Mode d'import :</Text>

              <TouchableOpacity style={styles.radioOption} onPress={() => setImportMode("replace")}>
                <View style={[styles.radioCircle, importMode === "replace" && styles.radioCircleSelected]}>
                  {importMode === "replace" && <View style={styles.radioInner} />}
                </View>
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioText}>Remplacer toutes mes données</Text>
                  <Text style={styles.radioSubtext}>Efface toutes les données existantes et les remplace par celles du fichier</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.radioOption} onPress={() => setImportMode("merge")}>
                <View style={[styles.radioCircle, importMode === "merge" && styles.radioCircleSelected]}>
                  {importMode === "merge" && <View style={styles.radioInner} />}
                </View>
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioText}>Fusionner avec mes données</Text>
                  <Text style={styles.radioSubtext}>Ajoute les nouvelles données en conservant les existantes</Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.warning}>
              ⚠️{" "}
              {importMode === "replace"
                ? "Attention : Cette action remplacera toutes vos données actuelles."
                : "Les données existantes seront conservées et complétées par les nouvelles."}
            </Text>

            {isImporting ? (
              <JMButton title="Import en cours..." disabled />
            ) : (
              <JMButton title="Importer des données" onPress={importData} variant="secondary" />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  scrollContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingBottom: 40,
  },
  title: {
    width: "80%",
    flexShrink: 0,
    textAlign: "center",
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: "bold",
    marginBottom: 40,
  },
  section: {
    width: "100%",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.BLUE,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: colors.DARK_BLUE,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  warning: {
    fontSize: 12,
    color: "#ff6b6b",
    textAlign: "center",
    marginBottom: 20,
    fontStyle: "italic",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 30,
    width: "50%",
    alignSelf: "center",
  },
  radioGroup: {
    marginVertical: 20,
  },
  radioGroupTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.BLUE,
    marginBottom: 15,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.BLUE,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  radioCircleSelected: {
    borderColor: colors.BLUE,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.BLUE,
  },
  radioTextContainer: {
    flex: 1,
  },
  radioText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.BLUE,
    marginBottom: 4,
  },
  radioSubtext: {
    fontSize: 13,
    color: colors.DARK_BLUE,
    lineHeight: 18,
  },
});

export default DataExportImport;

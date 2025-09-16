import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from "react-native";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HOST, HMAC_SECRET } from "../../config";
import app from "../../../app.json";
import { useUserProfile } from "@/context/userProfile";
import { DiaryDataContext, wipeData } from "@/context/diaryData";
import JMButton from "@/components/JMButton";
import { confirm } from "../../utils";
import * as Sentry from "@sentry/react-native";
import { beforeToday, formatDay } from "../../utils/date/helpers";

const CollapsibleSection = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View style={styles.section}>
      <TouchableOpacity style={styles.sectionHeader} onPress={() => setIsExpanded(!isExpanded)}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={[styles.arrow, isExpanded && styles.arrowDown]}>›</Text>
      </TouchableOpacity>
      {isExpanded && children}
    </View>
  );
};

const DevMode = ({ navigation }) => {
  const { clearProfile, loadProfile } = useUserProfile();
  const [_diaryData, _addEntryToDiaryData, internal__deleteDiaryData, _import, internal__deleteAllDiaryData] = useContext(DiaryDataContext);
  const disableDevMode = async () => {
    await AsyncStorage.setItem("devMode", "false");
    navigation.navigate("tabs");
  };

  const [deviceId, setDeviceId] = useState<string | null>(null);

  const fetchDeviceId = async () => {
    const id = await AsyncStorage.getItem("deviceId");
    setDeviceId(id);
  };

  const sendSentryTest = () => {
    try {
      // Add context information
      Sentry.setContext("dev_test", {
        timestamp: new Date().toISOString(),
        deviceId: deviceId,
        appVersion: app.expo.version,
        buildNumber: Platform.OS === "ios" ? app.expo.ios.buildNumber : app.expo.android.versionCode,
        platform: Platform.OS,
        testType: "dev_mode_manual_test",
      });

      // Send a test error
      Sentry.captureException(new Error("Dev Mode Test Error - This is a test error sent from dev mode"));

      // Also send a test message
      Sentry.captureMessage("Dev Mode Test Message - Sentry integration test", "info");

      Alert.alert("Test Sent", "Test error and message have been sent to Sentry. Check your Sentry dashboard to verify the integration is working.", [
        { text: "OK" },
      ]);
    } catch (error) {
      Alert.alert("Test Failed", `Failed to send test to Sentry: ${error.message}`, [{ text: "OK" }]);
    }
  };

  useEffect(() => {
    fetchDeviceId();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <CollapsibleSection title="Environment">
        <Text>Host: {HOST}</Text>
        <Text>HMAC: {HMAC_SECRET ? `...${HMAC_SECRET.slice(-5)}` : "empty"}</Text>
      </CollapsibleSection>

      <CollapsibleSection title="App Version">
        <Text>Version: {app.expo.version}</Text>
        <Text>Build: {Platform.OS === "ios" ? app.expo.ios.buildNumber : app.expo.android.versionCode}</Text>
      </CollapsibleSection>

      <CollapsibleSection title="Local Storage">
        <Text>Device ID: {deviceId}</Text>
      </CollapsibleSection>

      <CollapsibleSection title="Sentry Testing">
        <Text style={styles.sectionDescription}>Test Sentry error reporting integration</Text>
        <JMButton className="mt-2" title="Send Test to Sentry" variant="outline" onPress={sendSentryTest} />
      </CollapsibleSection>

      <JMButton
        className="mb-4"
        title="Supprimer toutes mes données"
        variant="outline"
        onPress={() => {
          confirm({
            title: "Supprimer toutes les données",
            message:
              "Cette action supprimera définitivement toutes vos données et vous ramènera à l'écran d'accueil. Cette action est irréversible.\n\nÊtes-vous sûr de vouloir continuer ?",
            confirmText: "Confirmer",
            cancelText: "Annuler",
            onConfirm: async () => {
              try {
                await internal__deleteAllDiaryData();
                await wipeData();
                await AsyncStorage.clear();
                await clearProfile();
                await loadProfile();
                navigation.reset({
                  index: 0,
                  routes: [{ name: "onboarding" }],
                });
              } catch (e) {
                console.error(e);
              }
            },
            onCancel: (e) => {
              console.log(e);
              // No action needed, dialog will close automatically
            },
          });
        }}
      ></JMButton>
      <JMButton
        className="mb-4"
        title="Supprimer mes données d'aujourd'hui"
        variant="outline"
        onPress={() => {
          confirm({
            title: "Supprimer toutes les données",
            message: "Cette action supprimera définitivement toutes vos données enregistré pour le jour d'aujourd'hui",
            confirmText: "Confirmer",
            cancelText: "Annuler",
            onConfirm: async () => {
              // No action needed, dialog will close automatically
              if (internal__deleteDiaryData) internal__deleteDiaryData(formatDay(beforeToday(0)));
            },
            onCancel: () => {},
          });
        }}
      ></JMButton>
      <TouchableOpacity style={styles.button} onPress={disableDevMode}>
        <Text style={styles.buttonText}>Disable Dev Mode</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.DARK_BLUE,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.DARK_BLUE,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.DARK_BLUE,
    marginBottom: 10,
    opacity: 0.7,
  },
  button: {
    backgroundColor: colors.DARK_BLUE,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  arrow: {
    fontSize: 24,
    color: colors.DARK_BLUE,
    transform: [{ rotate: "-90deg" }],
  },
  arrowDown: {
    transform: [{ rotate: "90deg" }],
  },
});

export default DevMode;

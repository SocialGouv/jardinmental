import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert, Switch } from "react-native";
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
import { fakeDiaryData2, startDate as fakeStartDate, fakeDiaryData } from "../status/fake-diary-data";
import { STORAGE_KEY_START_DATE } from "@/utils/constants";
import localStorage from "@/utils/localStorage";
import { INDICATOR_TYPE } from "@/entities/IndicatorType";
import { INDICATORS_CATEGORIES } from "@/entities/IndicatorCategories";
import NotificationService from "@/services/notifications";
import { useDevCorrelationConfig, DEFAULT_CONFIG, VALUE_RANGES } from "@/hooks/useDevCorrelationConfig";

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
  const [_diaryData, _addEntryToDiaryData, internal__deleteDiaryData, importDiaryData, internal__deleteAllDiaryData] = useContext(DiaryDataContext);
  const { config, saveConfig, resetConfig } = useDevCorrelationConfig();

  const disableDevMode = async () => {
    await AsyncStorage.setItem("devMode", "false");
    navigation.navigate("tabs");
  };

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);

  const fetchDeviceId = async () => {
    const id = await AsyncStorage.getItem("deviceId");
    setDeviceId(id);
  };

  const fetchPushToken = async () => {
    try {
      const hasTokenValue = await NotificationService.hasToken();
      if (hasTokenValue) {
        const token = await NotificationService.getToken();
        setPushToken(token ?? null);
      }
    } catch (error) {
      console.error("Error fetching push token:", error);
      setPushToken(null);
    }
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
    fetchPushToken();
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
        <Text>Push Token: {pushToken || "Non disponible"}</Text>
      </CollapsibleSection>

      <CollapsibleSection title="Sentry Testing">
        <Text style={styles.sectionDescription}>Test Sentry error reporting integration</Text>
        <JMButton className="mt-2" title="Send Test to Sentry" variant="outline" onPress={sendSentryTest} />
      </CollapsibleSection>

      <CollapsibleSection title="Configuration Corrélation">
        <Text style={styles.sectionDescription}>Configurer les paramètres pour CorrelationChart / ModalCorrelation</Text>

        {/* Pagination Switch */}
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Activer la pagination</Text>
          <Switch
            value={config.enablePagination}
            onValueChange={(value) => saveConfig({ enablePagination: value })}
            trackColor={{ false: "#767577", true: colors.DARK_BLUE }}
            thumbColor={config.enablePagination ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>

        {/* Hide Data Points Switch */}
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Masquer les points</Text>
          <Switch
            value={config.hideDataPoints}
            onValueChange={(value) => saveConfig({ hideDataPoints: value })}
            trackColor={{ false: "#767577", true: colors.DARK_BLUE }}
            thumbColor={config.hideDataPoints ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>

        {/* Use Custom Renderers Switch */}
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>Utiliser renderers personnalisés</Text>
          <Switch
            value={config.useCustomRenderers}
            onValueChange={(value) => saveConfig({ useCustomRenderers: value })}
            trackColor={{ false: "#767577", true: colors.DARK_BLUE }}
            thumbColor={config.useCustomRenderers ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>

        {/* CHUNK_SIZE Control */}
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>CHUNK_SIZE: {config.chunkSize}</Text>
          <View style={styles.counterButtons}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                const newValue = Math.max(VALUE_RANGES.chunkSize.min, config.chunkSize - 10);
                saveConfig({ chunkSize: newValue });
              }}
            >
              <Text style={styles.counterButtonText}>-10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                const newValue = Math.max(VALUE_RANGES.chunkSize.min, config.chunkSize - 1);
                saveConfig({ chunkSize: newValue });
              }}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                const newValue = Math.min(VALUE_RANGES.chunkSize.max, config.chunkSize + 1);
                saveConfig({ chunkSize: newValue });
              }}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                const newValue = Math.min(VALUE_RANGES.chunkSize.max, config.chunkSize + 10);
                saveConfig({ chunkSize: newValue });
              }}
            >
              <Text style={styles.counterButtonText}>+10</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MAX_DAYS Control */}
        <View style={styles.configRow}>
          <Text style={styles.configLabel}>MAX_DAYS: {config.maxDays}</Text>
          <View style={styles.counterButtons}>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                const newValue = Math.max(VALUE_RANGES.maxDays.min, config.maxDays - 10);
                saveConfig({ maxDays: newValue });
              }}
            >
              <Text style={styles.counterButtonText}>-10</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                const newValue = Math.max(VALUE_RANGES.maxDays.min, config.maxDays - 1);
                saveConfig({ maxDays: newValue });
              }}
            >
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                const newValue = Math.min(VALUE_RANGES.maxDays.max, config.maxDays + 1);
                saveConfig({ maxDays: newValue });
              }}
            >
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => {
                const newValue = Math.min(VALUE_RANGES.maxDays.max, config.maxDays + 10);
                saveConfig({ maxDays: newValue });
              }}
            >
              <Text style={styles.counterButtonText}>+10</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Button */}
        <JMButton
          className="mt-2"
          title="Réinitialiser aux valeurs par défaut"
          variant="outline"
          onPress={() => {
            Alert.alert(
              "Réinitialiser",
              `Remettre aux valeurs par défaut?\n\nPagination: ${DEFAULT_CONFIG.enablePagination ? "Oui" : "Non"}\nCHUNK_SIZE: ${
                DEFAULT_CONFIG.chunkSize
              }\nMAX_DAYS: ${DEFAULT_CONFIG.maxDays}`,
              [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Réinitialiser",
                  onPress: () => resetConfig(),
                },
              ]
            );
          }}
        />
      </CollapsibleSection>

      <JMButton
        className="mb-4"
        title="Supprimer toutes mes données"
        variant="text"
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
        variant="text"
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
      <JMButton
        variant="text"
        className="mb-4"
        title="Complétez avec des fausses données"
        onPress={() => {
          confirm({
            title: "Complétez avec des fausses données",
            message:
              "Cette action rajoutera définitivement des fausses données. Cette action est irréversible.\n\nÊtes-vous sûr de vouloir continuer ?",
            confirmText: "Confirmer",
            cancelText: "Annuler",
            onConfirm: async () => {
              await AsyncStorage.setItem(STORAGE_KEY_START_DATE, formatDay(fakeStartDate));
              await localStorage.addIndicateur({
                name: "ANXIETY",
                type: INDICATOR_TYPE.gauge,
                version: 0,
                uuid: "",
                category: INDICATORS_CATEGORIES["Emotions/sentiments"],
                newCategories: [],
                order: "ASC",
                active: true,
                position: 0,
                created_at: undefined,
              });
              await localStorage.addIndicateur({
                name: "BADTHOUGHTS",
                type: INDICATOR_TYPE.gauge,
                version: 0,
                uuid: "",
                category: INDICATORS_CATEGORIES["Emotions/sentiments"],
                newCategories: [],
                order: "ASC",
                active: true,
                position: 0,
                created_at: undefined,
              });
              await importDiaryData(
                {
                  ...fakeDiaryData2,
                  ...fakeDiaryData,
                },
                "merge"
              );
            },
            onCancel: () => {
              // No action needed, dialog will close automatically
            },
          });
        }}
      ></JMButton>
      <JMButton className="mb-16" onPress={disableDevMode} title="Disable Dev Mode"></JMButton>
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
  configRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingVertical: 5,
  },
  configLabel: {
    fontSize: 16,
    color: colors.DARK_BLUE,
    flex: 1,
  },
  counterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  counterButton: {
    backgroundColor: colors.DARK_BLUE,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 40,
    alignItems: "center",
  },
  counterButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default DevMode;

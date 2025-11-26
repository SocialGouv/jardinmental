import React, { useEffect, useState } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, useWindowDimensions, Text } from "react-native";
import SettingItem from "./setting-item";
import Bell from "@assets/svg/icon/Bell";
import Goal from "@assets/svg/icon/Goal";
import Save from "@assets/svg/icon/Save";
import Health from "@assets/svg/icon/Health";
import Analytics from "@assets/svg/icon/Analytics";
import Download from "@assets/svg/icon/Download";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { DrugsBottomSheet } from "@/components/DrugsBottomSheet";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";
import Header from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { typography } from "@/utils/typography";
import { mergeClassNames } from "@/utils/className";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const SettingsModal = ({ navigation, visible }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const ContentWrapper = isLandscape ? ScrollView : View;

  const [isDevMode, setIsDevMode] = useState(false);

  useFocusEffect(() => {
    (async () => {
      const devMode = await AsyncStorage.getItem("devMode");
      setIsDevMode(devMode === "true");
    })();
  });

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1">
      <View className="bg-cnam-primary-800 flex flex-row justify-between pb-0">
        <Header navigation={navigation} scrollY={scrollY} />
      </View>
      <Animated.ScrollView
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
        className="bg-cnam-primary-50 flex-1 px-4"
        onScroll={scrollHandler}
      >
        <View className="flex-col space-y-10">
          <View className="mx-2 mt-10">
            <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900 mb-4")}>Personnaliser mon suivi</Text>
            <SettingItem
              title="Mes indicateurs"
              description="Éditer et personnaliser mon suivi quotidien"
              path="symptoms"
              isFirst={true}
              navigation={navigation}
              onClick={(path) => {
                logEvents.logOpenIndicatorsSettings();
              }}
              icon={<Analytics />}
            />
            <SettingItem
              title="Mes objectifs"
              description="Ajouter ou modifier des objectifs"
              path="goals-settings"
              navigation={navigation}
              onClick={() => {
                logEvents.logOpenObjectivesSettings();
              }}
              icon={<Goal />}
            />
            <SettingItem
              title="Mon traitement"
              description="Ajouter ou modifier un traitement"
              navigation={navigation}
              onClick={async () => {
                logEvents.logOpenDrugSettings();
                const treatment = await localStorage.getMedicalTreatment();
                if (treatment) {
                  navigation.navigate("drugs-management", { treatment });
                } else {
                  showBottomSheet(
                    <DrugsBottomSheet
                      onClose={() => {
                        closeBottomSheet();
                      }}
                    />
                  );
                }
              }}
              icon={<Health />}
            />
            <SettingItem
              isLast={true}
              title="Programmer un rappel"
              description="Ajouter et personnaliser un rappel"
              path="reminder"
              navigation={navigation}
              onClick={() => {
                logEvents.logOpenReminderSettings();
              }}
              icon={<Bell />}
            />
          </View>
          <View className="mx-2">
            <Text className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900  mb-4")}>Gérer mes données</Text>
            <SettingItem
              isFirst={true}
              title="Générer un récapitulatif"
              description={"Télécharger mon historique sur 30 jours"}
              path="export"
              navigation={navigation}
              onClick={() => {
                logEvents.logOpenExportSummary();
              }}
              icon={<Download />}
            />
                      {isDevMode && (

            <SettingItem
              title="Sauvegarder / restaurer mes données"
              description={"Conserver mes données ou changer d’appareil"}
              path="data-export-import"
              navigation={navigation}
              onClick={() => {
                logEvents.logOpenExportSummary();
              }}
              isLast={true}
              icon={<Save />}
            />)}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default SettingsModal;

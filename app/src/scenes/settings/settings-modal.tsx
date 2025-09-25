import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, useWindowDimensions } from "react-native";
import SettingItem from "./setting-item";
import Bell from "@assets/svg/icon/Bell";
import Goal from "@assets/svg/icon/Goal";
import Health from "@assets/svg/icon/Health";
import Analytics from "@assets/svg/icon/Analytics";
import Download from "@assets/svg/icon/Download";
import { useBottomSheet } from "@/context/BottomSheetContext";
import { DrugsBottomSheet } from "@/components/DrugsBottomSheet";
import localStorage from "@/utils/localStorage";
import logEvents from "@/services/logEvents";

const SettingsModal = ({ navigation, visible, onClick }) => {
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const ContentWrapper = isLandscape ? ScrollView : View;

  return (
    <Modal animationType="slide" visible={visible} transparent={true} supportedOrientations={["portrait", "landscape"]}>
      <TouchableOpacity activeOpacity={1} style={styles.container} onPressOut={onClick}>
        <ContentWrapper style={styles.card}>
          <SettingItem title="Définir un rappel" path="reminder" navigation={navigation} onClick={onClick} icon={<Bell />} />
          <SettingItem
            title="Personnaliser mes indicateurs"
            path="symptoms"
            navigation={navigation}
            onClick={(path) => {
              logEvents.logOpenIndicatorsSettings();
              onClick(path);
            }}
            icon={<Analytics />}
          />
          <SettingItem title="Personnaliser mes objectifs" path="goals-settings" navigation={navigation} onClick={onClick} icon={<Goal />} />
          <SettingItem
            title="Saisir mon traitement"
            navigation={navigation}
            onClick={async () => {
              logEvents.logOpenDrugSettings();
              onClick();
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
          <SettingItem title="Générer un récapitulatif de mes données" path="export" navigation={navigation} onClick={onClick} icon={<Download />} />
        </ContentWrapper>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#0A215C50",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingBottom: 30,
    maxHeight: "80%", // prevents overflow in landscape
  },
});

export default SettingsModal;

import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import SettingItem from "./setting-item";
import { wipeData } from "@/context/diaryData";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Bell from "@assets/svg/icon/Bell";
import Goal from "@assets/svg/icon/Goal";
import Health from "@assets/svg/icon/Health";
import Analytics from "@assets/svg/icon/Analytics";
import Download from "@assets/svg/icon/Download";
import Trash from "@assets/svg/icon/Trash";

const SettingsModal = ({ navigation, visible, onClick }) => {
  return (
    <Modal animationType="slide" visible={visible} transparent={true}>
      <TouchableOpacity activeOpacity={1} style={styles.container} onPressOut={onClick}>
        <View style={styles.card}>
          <SettingItem title="Définir un rappel" path="reminder" navigation={navigation} onClick={onClick} icon={<Bell />} />
          <SettingItem title="Personnaliser mes indicateurs" path="symptoms" navigation={navigation} onClick={onClick} icon={<Analytics />} />
          <SettingItem title="Personnaliser mes objectifs" path="goals-settings" navigation={navigation} onClick={onClick} icon={<Goal />} />
          <SettingItem title="Saisir mon traitement" path="drugs" navigation={navigation} onClick={onClick} icon={<Health />} />
          <SettingItem title="Générer un récapitulatif de mes données" path="export" navigation={navigation} onClick={onClick} icon={<Download />} />
          <SettingItem
            title="Supprimer toutes mes données"
            path=""
            navigation={navigation}
            onClick={async () => {
              await wipeData();
              await AsyncStorage.clear();
            }}
            icon={<Trash />}
          />
        </View>
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
  },
});

export default SettingsModal;

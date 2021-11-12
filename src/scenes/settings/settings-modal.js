import React from 'react';
import {View, StyleSheet, Modal, TouchableOpacity} from 'react-native';

import SettingItem from './setting-item';

const SettingsModal = ({navigation, visible, onClick}) => {
  return (
    <Modal animationType="slide" visible={visible} transparent={true}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPressOut={onClick}>
        <View style={styles.card}>
          <SettingItem
            title="Définir un rappel"
            path="reminder"
            navigation={navigation}
            onClick={onClick}
            icon="ReminderSettingSvg"
          />
          <SettingItem
            title="Personnaliser mon questionnaire"
            path="symptoms"
            navigation={navigation}
            onClick={onClick}
            icon="SymptomsSetting"
          />
          <SettingItem
            title="Saisir mon traitement"
            path="drugs"
            navigation={navigation}
            onClick={onClick}
            icon="DrugsSvg"
          />
          <SettingItem
            title="Activer la saisie pour un événement"
            path="activate-beck"
            navigation={navigation}
            onClick={onClick}
            icon="ThoughtsSvg"
          />
          <SettingItem
            title="Exporter mes données"
            path="export"
            navigation={navigation}
            onClick={onClick}
            icon="ExportDataSettingSvg"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#0A215C50',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingBottom: 30,
  },
});

export default SettingsModal;

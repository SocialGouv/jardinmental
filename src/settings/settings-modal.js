import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {colors} from '../common/colors';
import {icons} from '../common/constants';

import SettingItem from './setting-item';

function settingsModal({navigation, visible, onClick}) {
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
            title="Mes données suivies"
            path="symptoms"
            navigation={navigation}
            onClick={onClick}
            icon="SymptomsSetting"
          />
          <SettingItem
            title="Exporter mes données"
            path=""
            navigation={navigation}
            onClick={onClick}
            icon="ExportDataSettingSvg"
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

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

export default settingsModal;

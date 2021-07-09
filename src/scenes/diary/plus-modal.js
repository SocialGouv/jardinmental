import React from 'react';
import {View, StyleSheet, Modal, TouchableOpacity} from 'react-native';

import PlusItem from './plus-modal-item';

const SettingsModal = ({navigation, visible, onClick, startSurvey}) => {
  return (
    <Modal animationType="slide" visible={visible} transparent={true}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPressOut={onClick}>
        <View style={styles.card}>
          <PlusItem
            title="Suivi des symptômes"
            navigation={navigation}
            onClick={() => {
              onClick();
              startSurvey();
            }}
            icon="PlusSurveySvg"
          />
          <PlusItem
            title="Colonnes de Beck"
            path="beck"
            navigation={navigation}
            onClick={onClick}
            icon="PlusBeckSvg"
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
    backgroundColor: '#0A215Cdd',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 80,
  },
});

export default SettingsModal;

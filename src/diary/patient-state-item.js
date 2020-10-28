import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import CircledIcon from '../common/circled-icon';

const PatientStateItem = ({patientStateItem, category}) => {
  return (
    <View style={styles.container}>
      <CircledIcon
        color={patientStateItem.color}
        Icon={patientStateItem.icon}
      />
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  categoryText: {
    fontSize: 15,
  },
});

export default PatientStateItem;

import React from 'react';
import {StyleSheet, View} from 'react-native';
import PatientStateItem from './patient-state-item';
import {categories} from '../constants';
import NoDataDiaryItem from './no-data-diary-item';
import NoDataToday from './no-data-today';

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 20,
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
  },
});

const DiaryItem = ({patientState}) => {
  if (patientState === null) {
    return <NoDataDiaryItem />;
  }
  if (patientState === undefined) {
    return <NoDataToday />;
  }
  return (
    <View style={styles.container}>
      <PatientStateItem
        patientStateItem={patientState.mood}
        category={categories.mood}
      />
      <PatientStateItem
        patientStateItem={patientState.anxiety}
        category={categories.anxiety}
      />
      <PatientStateItem
        patientStateItem={patientState.badThought}
        category={categories.badThoughts}
      />
      <PatientStateItem
        patientStateItem={patientState.sleep}
        category={categories.sleep}
      />
      <PatientStateItem
        patientStateItem={patientState.sensations}
        category={categories.sensations}
      />
    </View>
  );
};

export default DiaryItem;

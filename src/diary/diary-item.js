import React from 'react';
import {StyleSheet, View} from 'react-native';
import PatientStateItem from './patient-state-item';
import {categories} from '../common/constants';
import NoDataYesterdayDiaryItem from './no-data-yesterday-diary-item';
import NoDataTodayDiaryItem from './no-data-today-diary-item';

const DiaryItem = ({patientState}) => {
  if (patientState === null) {
    return <NoDataYesterdayDiaryItem />;
  }
  if (patientState === undefined) {
    return <NoDataTodayDiaryItem />;
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

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 40,
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    paddingTop: 20,
    paddingBottom: 10,
  },
});

export default DiaryItem;

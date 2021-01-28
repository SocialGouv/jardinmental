import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PatientStateItem from './patient-state-item';
import {displayedCategories} from '../common/constants';
import NoDataYesterdayDiaryItem from './no-data-yesterday-diary-item';
import NoDataTodayDiaryItem from './no-data-today-diary-item';
import {isToday, isYesterday, parseISO} from 'date-fns';
import NoDataDiaryItem from './no-data-diary-item';
import Notes from './notes';
import localStorage from '../utils/localStorage';

const DiaryItem = ({patientState, startAtFirstQuestion, date}) => {
  const [customs, setCustoms] = useState([]);
  useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t) setCustoms(t);
    })();
  }, [patientState]);

  if (!patientState) {
    if (isToday(parseISO(date))) {
      return (
        <NoDataTodayDiaryItem startAtFirstQuestion={startAtFirstQuestion} />
      );
    } else if (isYesterday(parseISO(date))) {
      return (
        <NoDataYesterdayDiaryItem startAtFirstQuestion={startAtFirstQuestion} />
      );
    } else {
      return <NoDataDiaryItem />;
    }
  }
  return (
    <View style={styles.container}>
      {Object.keys(displayedCategories)
        .concat(customs)
        .map((key) => {
          if (!patientState[key]) {
            return;
          }
          const [categoryName, suffix] = key.split('_');
          if (suffix) {
            return (
              <PatientStateItem
                key={key}
                patientStateItem={patientState[key]}
                intensity={
                  patientState[`${categoryName}_INTENSITY`] || {level: 3}
                }
                category={displayedCategories[key] || categoryName}
              />
            );
          } else {
            return (
              <PatientStateItem
                key={key}
                patientStateItem={patientState[key]}
                category={displayedCategories[key]}
              />
            );
          }
        })}
      <Notes notes={patientState.NOTES} />
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

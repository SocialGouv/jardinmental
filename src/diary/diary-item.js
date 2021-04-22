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

const DiaryItem = ({navigation, patientState, startAtFirstQuestion, date}) => {
  const [customs, setCustoms] = useState([]);
  useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t) return setCustoms(t);
      return;
    })();
  }, [patientState]);

  const handleEditNotePress = () => {
    if (!(isToday(parseISO(date)) || isYesterday(parseISO(date)))) return;
    const currentSurvey = {
      date,
      answers: patientState,
    };
    navigation.navigate('notes', {
      currentSurvey,
    });
  };

  const hasAnswerSurvey = () =>
    Object.keys(displayedCategories)
      .concat(customs)
      .filter((key) => {
        return patientState && patientState[key];
      }).length;

  return (
    <View style={styles.container}>
      {!hasAnswerSurvey() ? (
        <NoDataDiaryItem date={date} />
      ) : (
        Object.keys(displayedCategories)
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
          })
      )}
      <Notes
        notes={patientState?.NOTES}
        date={date}
        onPress={handleEditNotePress}
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
  },
});

export default DiaryItem;

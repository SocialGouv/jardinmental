import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import PatientStateItem from './patient-state-item';
import {displayedCategories} from '../../utils/constants';
import {isToday, isYesterday, parseISO} from 'date-fns';
import NoDataDiaryItem from './no-data-diary-item';
import Notes from './notes';
import localStorage from '../../utils/localStorage';
import Posology from './posology';
import Beck from './beck';
import {startAtFirstQuestion} from '../survey/survey-data';

const DiaryItem = ({navigation, patientState, date}) => {
  const [customs, setCustoms] = useState([]);
  let mounted = useRef(true);

  useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t && mounted) return setCustoms(t);
    })();
    return () => (mounted = false);
  }, [patientState]);

  const handleEdit = (tab) => {
    if (!(isToday(parseISO(date)) || isYesterday(parseISO(date)))) return;
    const currentSurvey = {
      date,
      answers: patientState,
    };
    navigation.navigate(tab, {
      currentSurvey,
      redirect: true,
    });
  };
  const handleViewBeck = (beck, beckId) => {
    navigation.navigate('view-beck', {
      beckId,
      beck,
      redirect: true,
    });
  };
  const hasAnswerSurvey = () =>
    Object.keys(displayedCategories)
      .concat(customs)
      .filter((key) => {
        return patientState && patientState[key];
      }).length;

  const handlePressItem = () => {
    if (!(isToday(parseISO(date)) || isYesterday(parseISO(date))))
      return navigation.navigate('too-late', {date});
    startAtFirstQuestion(date, navigation);
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={handlePressItem}>
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
        onPress={() => handleEdit('notes')}
      />
      <Beck
        data={patientState?.becks}
        date={date}
        onPress={(beck, beckId) => handleViewBeck(beck, beckId)}
      />
      <Posology
        data={patientState?.POSOLOGY}
        date={date}
        onPress={() => handleEdit('drugs')}
      />
    </TouchableOpacity>
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

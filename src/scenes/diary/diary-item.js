import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import PatientStateItem from './patient-state-item';
import {displayedCategories} from '../../utils/constants';
import NoDataDiaryItem from './no-data-diary-item';
import Notes from './notes';
import localStorage from '../../utils/localStorage';
import Posology from './posology';
import Beck from './beck';
import {canEdit} from './diary';

const DiaryItem = ({navigation, patientState, date}) => {
  const [customs, setCustoms] = useState([]);
  const [oldCustoms, setOldCustoms] = useState([]);
  let mounted = useRef(true);

  useEffect(() => {
    (async () => {
      const c = await localStorage.getCustomSymptoms();
      if (c && mounted) setCustoms(c);

      //retrocompatibility
      const t = c.map((e) => `${e}_FREQUENCE`);
      if (t && mounted) setOldCustoms(t);
      return;
    })();
    return () => (mounted = false);
  }, [patientState]);

  const handleEdit = (tab) => {
    if (!canEdit(date)) return;
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
    if (!canEdit(date)) return navigation.navigate('too-late', {date});
    handleEdit('day-survey');
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
          .concat(oldCustoms)
          .map((key) => {
            if (!patientState[key]) {
              return;
            }
            const [categoryName] = key.split('_');
            return (
              <PatientStateItem
                key={key}
                category={key}
                patientState={patientState}
                label={displayedCategories[key] || categoryName}
              />
            );
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

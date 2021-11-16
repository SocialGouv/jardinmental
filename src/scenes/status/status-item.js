import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import PatientStateItem from './patient-state-item';
import {displayedCategories} from '../../utils/constants';
import NoDataDiaryItem from './no-data-status-item';
import Notes from './notes';
import localStorage from '../../utils/localStorage';
import Posology from './posology';
import {canEdit} from './utils/index.js';

export default ({navigation, patientState, date}) => {
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
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.item}
        onPress={handlePressItem}>
        {!hasAnswerSurvey() ? (
          <NoDataDiaryItem date={date} />
        ) : (
          <View>
            {Object.keys(displayedCategories)
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
              })}
            <View style={styles.divider} />
            <Posology
              data={patientState?.POSOLOGY}
              date={date}
              onPress={() => handleEdit('drugs')}
            />
            <View style={styles.divider} />
            <Notes
              notes={patientState?.NOTES}
              date={date}
              onPress={() => handleEdit('notes')}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    marginTop: 15,
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    paddingVertical: 10,
    marginBottom: 15,
  },
  container: {
    paddingLeft: 15,
    marginLeft: 10,
    borderLeftWidth: 0.4,
    borderColor: '#00CEF7',
  },
  divider: {
    height: 1,
    backgroundColor: '#6BD1F3',
    marginVertical: 10,
    width: '60%',
    alignSelf: 'center',
  },
});

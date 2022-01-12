import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import PatientStateItem from './patient-state-item';
import {displayedCategories} from '../../utils/constants';
import NoDataDiaryItem from './no-data-status-item';
import Notes from './notes';
import localStorage from '../../utils/localStorage';
import Posology from './posology';
import {canEdit} from './utils/index.js';
import Button from '../../components/RoundButtonIcon';
import Toxic from './toxic';
import logEvents from '../../services/logEvents';

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
    logEvents.logFeelingEditButtonClick();
    handleEdit('day-survey');
  };

  if (hasAnswerSurvey()) {
    return (
      <View style={styles.container}>
        <View style={[styles.item, styles.itemWithSpaceAbove]}>
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
            <Toxic data={patientState?.TOXIC} />
            <Posology
              data={patientState?.POSOLOGY}
              date={date}
              onPress={() => handleEdit('drugs')}
            />
            <Notes
              notes={patientState?.NOTES}
              date={date}
              onPress={() => handleEdit('notes')}
            />
            <View style={styles.buttonsContainer}>
              <Button icon="pencil" visible={true} onPress={handlePressItem} />
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.item} onPress={handlePressItem}>
          <NoDataDiaryItem date={date} />
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  buttonsContainer: {
    width: '100%',
    display: 'flex',
    position: 'absolute',
    top: -38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    marginVertical: 15,
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    paddingVertical: 15,
  },
  itemWithSpaceAbove: {
    marginTop: 25,
    paddingTop: 20,
  },
  container: {
    paddingLeft: 15,
    marginLeft: 10,
    borderLeftWidth: 0.4,
    borderColor: '#00CEF7',
  },
});

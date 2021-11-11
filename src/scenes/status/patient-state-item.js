import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../components/MyText';
import CircledIcon from '../../components/CircledIcon';
import {scoresMapIcon} from '../../utils/constants';
import {getScoreWithState} from '../../utils';

const PatientStateItem = ({patientState, category, label}) => {
  const [{color, faceIcon}, setIcon] = useState({});

  useEffect(() => {
    const score = getScoreWithState({patientState, category});
    const icon = scoresMapIcon[score];
    icon && setIcon(icon);
  }, [patientState, category]);

  if (!color || !faceIcon) return null;

  return (
    <View style={styles.container}>
      <CircledIcon color={color} icon={faceIcon} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 15,
  },
});

export default PatientStateItem;

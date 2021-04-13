import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../components/MyText';
import CircledIcon from '../common/circled-icon';
import {colorsMap} from '../common/constants';

const PatientStateItem = ({patientStateItem, category, intensity}) => {
  const [color, setColor] = useState(patientStateItem.color);

  useEffect(() => {
    const modifier = intensity ? intensity.level - 1 : 0;
    setColor(colorsMap[patientStateItem.level + modifier - 1]);
  }, [patientStateItem, intensity]);

  return (
    <View style={styles.container}>
      <CircledIcon color={color} icon={patientStateItem.icon} />
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

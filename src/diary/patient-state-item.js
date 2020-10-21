import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'lightgrey',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  categoryText: {
    fontSize: 15,
  },
});

const PatientStateItem = ({patientStateItem, category}) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.iconContainer,
          backgroundColor: patientStateItem.color,
        }}>
        <patientStateItem.icon width={20} height={20} />
      </View>
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  );
};

export default PatientStateItem;

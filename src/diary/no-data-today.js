import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Button from '../common/button';

const styles = StyleSheet.create({
  noDataContainer: {
    backgroundColor: 'rgba(31, 198, 213, 0.2)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F4FCFD',
    marginBottom: 20,
    padding: 15,
  },
  noDataTitle: {
    fontWeight: 'bold',
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

const NoDataToday = () => {
  return (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>Comment se passe ta journée ?</Text>
      <Text>Faisons ensemble un petit point sur tes ressentis</Text>
      <View style={styles.buttonWrapper}>
        <Button title="Commencer" />
      </View>
    </View>
  );
};

export default NoDataToday;

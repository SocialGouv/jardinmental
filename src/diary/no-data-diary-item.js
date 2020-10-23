import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import Button from '../common/button';

const styles = StyleSheet.create({
  noDataContainer: {
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
  noDataTitle: {
    fontWeight: 'bold',
  },
  textContainer: {
    padding: 15,
    width: '65%',
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

const NoDataDiaryItem = () => {
  return (
    <View style={styles.noDataContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.noDataTitle}>Aucune information</Text>
        <Text>Clique ici pour compléter tes informations</Text>
        <View style={styles.buttonWrapper}>
          <Button title="Ajouter" />
        </View>
      </View>
      <Image
        style={styles.image}
        source={require('../../assets/imgs/no-data.png')}
      />
    </View>
  );
};

export default NoDataDiaryItem;

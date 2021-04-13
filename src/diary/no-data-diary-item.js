import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../components/MyText';
import {colors} from '../common/colors';

const NoDataDiaryItem = () => {
  return (
    <View style={styles.noDataContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.noDataTitle}>
          Vous n'avez rien saisi ce jour-là
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  noDataContainer: {
    backgroundColor: 'rgba(38, 56, 124, 0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(38, 56, 124, 0.08)',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 20,
  },
  noDataTitle: {
    fontWeight: 'bold',
    color: colors.BLUE,
  },
  textContainer: {
    padding: 15,
  },
});

export default NoDataDiaryItem;

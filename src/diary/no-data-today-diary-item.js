import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Button from '../common/button';
import {colors} from '../common/colors';
import {formatDay} from '../services/date/helpers';

const NoDataTodayDiaryItem = ({startAtFirstQuestion}) => {
  return (
    <View style={styles.noDataContainer}>
      <Text style={styles.noDataTitle}>Comment se passe ta journée ?</Text>
      <Text style={styles.noDataText}>
        Faisons ensemble un petit point sur tes ressentis
      </Text>
      <View style={styles.buttonWrapper}>
        <Button
          title="Commencer"
          buttonColor="white"
          textColor={colors.BLUE}
          onPress={() => startAtFirstQuestion(formatDay(new Date()))}
        />
      </View>
    </View>
  );
};

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
    color: colors.BLUE,
  },
  noDataText: {
    color: colors.BLUE,
  },
  buttonWrapper: {
    paddingTop: 10,
  },
});

export default NoDataTodayDiaryItem;

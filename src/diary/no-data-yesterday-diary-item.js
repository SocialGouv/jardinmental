import React from 'react';
import {StyleSheet, View, Text, Image} from 'react-native';
import Button from '../common/button';
import {colors} from '../common/colors';
import {beforeToday, formatDay} from '../services/date/helpers';
import logEvents from '../services/logEvents';

const NoDataYesterdayDiaryItem = ({startAtFirstQuestion}) => {
  const onStartPress = () => {
    logEvents.logFeelingDateChoose('yesterday');
    startAtFirstQuestion(formatDay(beforeToday(1)));
  };

  return (
    <View style={styles.noDataContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.noDataTitle}>Aucune information</Text>
        <Text style={styles.noDataText}>
          Cliquez ici pour compléter vos informations
        </Text>
        <View style={styles.buttonWrapper}>
          <Button title="Ajouter" onPress={onStartPress} />
        </View>
      </View>
      <Image
        style={styles.image}
        source={require('../../assets/imgs/no-data.png')}
      />
    </View>
  );
};

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
    color: colors.BLUE,
  },
  noDataText: {
    color: colors.BLUE,
  },
  textContainer: {
    padding: 15,
    width: '66%',
  },
  buttonWrapper: {
    paddingTop: 10,
  },
  image: {
    width: 120,
    height: 140,
  },
});

export default NoDataYesterdayDiaryItem;

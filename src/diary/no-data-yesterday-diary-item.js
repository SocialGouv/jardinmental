import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../components/MyText';
import Button from '../common/button';
import {colors} from '../common/colors';
import {beforeToday, formatDay} from '../services/date/helpers';
import logEvents from '../services/logEvents';

export default ({startAtFirstQuestion}) => {
  const onStartPress = () => {
    logEvents.logFeelingDateChoose('yesterday');
    startAtFirstQuestion(formatDay(beforeToday(1)));
  };

  return (
    <TouchableOpacity style={styles.noDataContainer} onPress={onStartPress}>
      <Text style={styles.noDataTitle}>
        Comment s'est passée votre journée d'hier ?
      </Text>
      <Text style={styles.noDataText}>Faisons un point sur vos ressentis</Text>
      <View style={styles.buttonWrapper}>
        <Button
          title="Commencer"
          buttonColor="white"
          textColor={colors.BLUE}
          onPress={onStartPress}
        />
      </View>
    </TouchableOpacity>
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

import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Text from '../components/MyText';
import Button from '../common/button';
import {colors} from '../common/colors';
import {formatDay} from '../services/date/helpers';
import logEvents from '../services/logEvents';

export default ({startAtFirstQuestion, navigation}) => {
  const onStartPress = () => {
    logEvents.logFeelingDateChoose('today');
    startAtFirstQuestion(formatDay(new Date()), navigation);
  };

  return (
    <TouchableOpacity style={styles.noDataContainer} onPress={onStartPress}>
      <Text style={styles.noDataTitle}>Comment se passe votre journée ?</Text>
      <Text style={styles.noDataText}>Faisons un point sur vos ressentis</Text>
      <View style={styles.buttonWrapper}>
        <Button
          title="Commencer"
          buttonColor="white"
          textColor={colors.BLUE}
          onPress={onStartPress}
          buttonStyle={{width: '50%', height: 30}}
          textStyle={{fontSize: 15, fontWeight: 'normal'}}
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

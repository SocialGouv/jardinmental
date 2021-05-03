import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Text from '../components/MyText';
import ReminderSvg from '../../assets/svg/reminder.svg';
import {colors} from '../common/colors';
import BackButton from '../components/BackButton';
import {formatDate} from '../services/date/helpers';

export default ({navigation, route}) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (route?.params?.date) {
      setDate(route?.params?.date);
    }
  }, [route]);

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <ReminderSvg />
        <Text style={styles.title}>
          Il est trop tard pour saisir les informations du {formatDate(date)} !
        </Text>
        <View style={styles.description}>
          <Text style={styles.subTitle}>
            Pour s'assurer que les informations saisies sont fiables, il n'est
            possible de saisir que les données du{' '}
            <Text style={styles.bold}>jour même</Text> ou de{' '}
            <Text style={styles.bold}>la veille</Text>.
          </Text>
        </View>
        <TouchableOpacity
          onPress={navigation.goBack}
          style={styles.setupButton}>
          <Text style={styles.setupButtonText}>Retour au journal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  bold: {
    fontWeight: '700',
  },
  container: {
    padding: 40,
  },
  title: {
    width: '80%',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '700',
    marginTop: '10%',
  },
  description: {
    width: '80%',
    marginTop: '10%',
    marginBottom: '20%',
  },
  subTitle: {
    flexShrink: 0,
  },
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  setupButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
});

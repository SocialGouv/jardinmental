import React, {useEffect} from 'react';
import {StyleSheet, SafeAreaView, ScrollView, Linking} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import logEvents from '../../services/logEvents';
import BackButton from '../../components/BackButton';

const Contact = ({navigation}) => {
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      logEvents.logContactOpen();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView
        style={styles.cgu}
        contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Pour simplement parler à quelqu’un :</Text>
        <Text style={styles.content}>
          Numéro national de prévention du suicide, Gratuit, 24h/24 et 7j/7
          {'\n\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick(
                'Numéro national de prévention du suicide',
              );
              Linking.openURL('tel:3114');
            }}>
            3114
          </Text>
          {'\n\n\n'}
          SOS-amitiés, 24h/24 et 7j/7{'\n\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('SOS-amitiés');
              Linking.openURL('tel:09 72 39 40 50');
            }}>
            09 72 39 40 50
          </Text>
          {'\n\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('SOS-amitiés');
              Linking.openURL('tel:01 40 09 15 22');
            }}>
            01 40 09 15 22
          </Text>
          {'\n\n\n'}
          Fil Santé Jeune, Tous les jours, 9h-23h {'\n\n'}
          <Text
            style={styles.link}
            onPress={() => {
              logEvents.logInfoClick('SOS-amitiés');
              Linking.openURL('tel:0 800 235 236');
            }}>
            0 800 235 236
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  title: {
    color: colors.BLUE,
    fontSize: 20,
    padding: 20,
    fontWeight: '700',
  },
  cgu: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  content: {
    color: colors.DARK_BLUE,
    padding: 10,
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    margin: 100,
    color: colors.LIGHT_BLUE,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default Contact;

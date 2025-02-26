import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import BackButton from '../../components/BackButton';
import Icon from '../../components/Icon';
import localStorage from '../../utils/localStorage';
import logEvents from '../../services/logEvents';

export default ({navigation}) => {
  const [isBeckActivated, setIsBeckActivated] = useState();
  const getData = async () => {
    const isBeckActivatedInLocalStorage = await localStorage.getIsBeckActivated();
    if (
      isBeckActivatedInLocalStorage === null || // if the user hasnt specify it yet, beck is activated by default
      isBeckActivatedInLocalStorage === true
    )
      return setIsBeckActivated(true);
  };
  const handleClick = async v => {
    const alertTitle = v ? 'Activées' : 'Désactivées';
    const alertMessage = v ? 'Les colonnes de Beck sont activées sur cet appareil.' : 'Les colonnes de Beck sont désactivées sur cet appareil.';
    Alert.alert(alertTitle, alertMessage, [
      {
        text: 'Retourner au journal',
        onPress: () => navigation.navigate('tabs'),
        style: 'default',
      },
    ]);
    await localStorage.setIsBeckActivated(v);
    logEvents.logActivateBeck(v);
    setIsBeckActivated(v);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Icon icon="HeartsSvg" color="#1FC6D5" styleContainer={styles.icon} width={60} height={60} />
        <Text style={styles.title}>Colonnes de Beck</Text>
        <View style={styles.description}>
          <Text style={styles.subTitle}>Apprenez à identifier, comprendre et gérer vos pensées et vos émotions au quotidien.</Text>
        </View>
        {isBeckActivated ? (
          <>
            <TouchableOpacity onPress={() => handleClick(false)} style={styles.desactivateButton}>
              <Text style={styles.desactivateButtonText}>Désactiver</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigation.goBack}>
              <Text style={styles.backButtonText}>Retourner au journal</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => handleClick(true)} style={styles.activateButton}>
              <Text style={styles.activateButtonText}>Activer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigation.goBack}>
              <Text style={styles.backButtonText}>Retourner au journal</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  icon: {marginTop: 30, marginBottom: 30},
  scrollContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  bold: {
    fontWeight: '700',
  },
  title: {
    width: '80%',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
  },
  description: {
    width: '80%',
    marginTop: '10%',
    marginBottom: '20%',
  },
  subTitle: {
    fontSize: 17,
    flexShrink: 0,
    lineHeight: 25,
    textAlign: 'center',
  },
  activateButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  activateButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  desactivateButton: {
    backgroundColor: '#F0F1F6',
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  desactivateButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 19,
  },
  backButtonText: {
    marginTop: 20,
    fontWeight: 'normal',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
});

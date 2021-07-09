import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import BackButton from '../../components/BackButton';
import Icon from '../../components/Icon';
import localStorage from '../../utils/localStorage';

export default ({navigation}) => {
  const [isBeckActivated, setIsBeckActivated] = useState();
  const getData = async () => {
    const d = await localStorage.getIsBeckActivated();
    setIsBeckActivated(d);
  };
  const handleClick = async (v) => {
    const alertTitle = v ? 'Activées' : 'Désactivées';
    const alertMessage = v
      ? 'Les colonnes de Beck sont activées sur cet appareil.'
      : 'Les colonnes de Beck sont désactivées sur cet appareil.';
    Alert.alert(alertTitle, alertMessage);
    await localStorage.setIsBeckActivated(v);
    setIsBeckActivated(v);
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <BackButton onPress={navigation.goBack} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Icon
          icon="HeartsSvg"
          color="#1FC6D5"
          styleContainer={styles.icon}
          width={100}
          height={100}
        />
        {/* <ReminderSvg /> */}
        <Text style={styles.title}>Colonnes de Beck</Text>
        <View style={styles.description}>
          <Text style={styles.subTitle}>
            Apprenez à identifier, comprendre et gérer vos pensées et vos
            emotions au quotidien.
          </Text>
        </View>
        {isBeckActivated ? (
          <>
            <TouchableOpacity
              onPress={() => handleClick(false)}
              style={styles.desactivateButton}>
              <Text style={styles.desactivateButtonText}>Désactiver</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={navigation.goBack}>
              <Text style={styles.backButtonText}>Retourner au journal</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => handleClick(true)}
              style={styles.activateButton}>
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
  icon: {marginTop: '20%', marginBottom: '20%'},
  scrollContainer: {
    paddingBottom: 80,
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
    marginTop: '10%',
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

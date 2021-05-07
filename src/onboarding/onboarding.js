import React, {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, TouchableOpacity} from 'react-native';
import Text from '../components/MyText';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../common/colors';
import Swiper from 'react-native-swiper';
import localStorage from '../utils/localStorage';
import logEvents from '../services/logEvents';
import Button from '../common/button';
import ActiveDot from './ActiveDot';
import BackButton from '../components/BackButton';

const Onboarding = ({navigation}) => {
  const [isCguChecked, setIsCguChecked] = useState(false);
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    (async () => {
      const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
      setFirstTime(isFirstAppLaunch !== 'false');
    })();
  }, [navigation]);

  const validateOnboarding = async () => {
    const target = firstTime ? 'supported' : 'tabs';
    navigation.navigate(target);
    await localStorage.setIsFirstAppLaunch(false);
  };

  const onCguClick = () => {
    navigation.navigate('cgu');
  };

  const onLegalMentionsClick = () => {
    navigation.navigate('legal-mentions');
  };

  const onPrivacyClick = () => {
    navigation.navigate('privacy');
  };

  const onIndexChanged = (page) => {
    logEvents.logOnboardingSwipe(page);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {!firstTime ? <BackButton onPress={navigation.goBack} /> : null}
      <Text style={styles.title}>Mon Suivi Psy</Text>
      <Swiper
        loop={false}
        activeDot={<ActiveDot />}
        onIndexChanged={onIndexChanged}>
        <View style={styles.container}>
          <Text style={styles.presentationText}>
            Chaque jour, à l’heure que j’ai choisie,{' '}
            <Text style={styles.emphasis}>
              Mon Suivi Psy me rappelle de faire un point sur mes ressentis
            </Text>{' '}
            grâce à un questionnaire que je peux{' '}
            <Text style={styles.emphasis}>personnaliser</Text> à tout moment, en
            retirant ou en ajoutant des items à suivre.
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.presentationText}>
            A la clé, j’obtiens une{' '}
            <Text style={styles.emphasis}>
              courbe de l’évolution de mes ressentis,
            </Text>
            semaine après semaine.{' '}
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.presentationText}>
            Je peux{' '}
            <Text style={styles.emphasis}>
              adresser ces informations, par mail{' '}
            </Text>
            , à mon médecin ou à mon psychologue, uniquement si je le souhaite
            bien sûr, pour l’aider à mieux comprendre ce qui m’arrive{' '}
          </Text>
        </View>
      </Swiper>

      {firstTime ? (
        <>
          <View style={styles.cgu}>
            <CheckBox
              animationDuration={0.2}
              tintColor="#1FC6D5"
              tintColors={{true: '#1FC6D5', false: 'grey'}}
              boxType="square"
              style={styles.checkbox}
              value={isCguChecked}
              onValueChange={(newValue) => setIsCguChecked(newValue)}
            />
            <Text style={styles.textCgu}>
              En cochant cette case, vous acceptez nos{' '}
              <Text onPress={onCguClick} style={styles.underlined}>
                Conditions Générales d’Utilisation
              </Text>
              , notre{' '}
              <Text onPress={onPrivacyClick} style={styles.underlined}>
                Politique de Confidentialité
              </Text>{' '}
              et nos{' '}
              <Text onPress={onLegalMentionsClick} style={styles.underlined}>
                Mentions Légales
              </Text>
            </Text>
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              onPress={validateOnboarding}
              title="Commencer"
              disabled={!isCguChecked && firstTime}
            />
          </View>
        </>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
    display: 'flex',
  },
  checkbox: {
    marginRight: 20,
  },
  label: {
    width: '100%',
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  ValidationButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    padding: 20,
    fontWeight: '700',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'flex-end',
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
  },
  cgu: {
    padding: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  textCgu: {
    flex: 1,
  },
  emphasis: {
    color: '#1FC6D5',
  },
  presentationText: {
    fontSize: 20,
    color: '#0A215C',
  },
  underlined: {
    textDecorationLine: 'underline',
  },
  message: {
    fontSize: 22,
    padding: 15,
    color: colors.DARK_BLUE,
  },
});

export default Onboarding;

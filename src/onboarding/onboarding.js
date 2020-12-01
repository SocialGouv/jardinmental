import React, {useState} from 'react';
import {StyleSheet, Text, SafeAreaView, View} from 'react-native';
import {colors} from '../common/colors';
import Button from '../common/button';
import Swiper from 'react-native-swiper';
import CheckBox from '@react-native-community/checkbox';
import localStorage from '../utils/localStorage';
import ActiveDot from './active-dot';

const Onboarding = ({navigation}) => {
  const [isCguChecked, setIsCguChecked] = useState(false);

  const validateOnboarding = async () => {
    navigation.navigate('tabs');
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

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Mon Suivi Psy</Text>
      <Swiper loop={false} activeDot={<ActiveDot />}>
        <View style={styles.container}>
          <Text style={styles.presentationText}>
            Mieux suivre l’évolution de mes symptômes{'\n'}
          </Text>
          <Text style={styles.presentationText}>
            Service <Text style={styles.emphasis}>Gratuit</Text> et{' '}
            <Text style={styles.emphasis}>Anonyme</Text>
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.presentationText}>
            Choisissez les symptômes que vous souhaitez suivre{'\n'}
          </Text>
          <Text style={styles.presentationText}>
            Visualisez leur évolution sur des courbes
          </Text>
        </View>
        <View style={styles.container}>
          <Text style={styles.presentationText}>
            Envoyer le récapitulatif des courbes à votre votre psychiatre, à
            votre médecin, à votre psychologue, si vous le souhaitez
          </Text>
        </View>
      </Swiper>
      <View style={styles.buttonWrapper}>
        <Button
          onPress={validateOnboarding}
          title="Commencer"
          disabled={!isCguChecked}
        />
      </View>
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
        <Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
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
    width: '90%',
  },
  emphasis: {
    color: '#1FC6D5',
  },
  presentationText: {
    fontSize: 30,
  },
  underlined: {
    textDecorationLine: 'underline',
  },
});

export default Onboarding;

import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Text from '../../components/MyText';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../../utils/colors';
import Swiper from 'react-native-swiper';
import localStorage from '../../utils/localStorage';
import logEvents from '../../services/logEvents';
import Button from '../../components/Button';
import ActiveDot from './ActiveDot';
import BackButton from '../../components/BackButton';
import {Screen1, Screen2, Screen3} from './screens';

const Onboarding = ({navigation}) => {
  const [isCguChecked, setIsCguChecked] = useState(false);
  const [firstTime, setFirstTime] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef();

  useEffect(() => {
    (async () => {
      const isFirstAppLaunch = await localStorage.getIsFirstAppLaunch();
      setFirstTime(isFirstAppLaunch !== 'false');
    })();
  }, [navigation]);

  const validateOnboarding = async () => {
    const target = firstTime ? 'supported' : 'tabs';
    navigation.navigate(target);
  };

  const onCguClick = () => navigation.navigate('cgu');
  const onLegalMentionsClick = () => navigation.navigate('legal-mentions');
  const onPrivacyClick = () => navigation.navigate('privacy');

  const onPressNext = () => swiperRef?.current?.scrollBy(1);

  return (
    <SafeAreaView style={styles.safe}>
      {!firstTime ? <BackButton onPress={navigation.goBack} /> : null}
      <Text style={styles.title}>
        Mon Suivi Psy m'accompagne entre mes consultations
      </Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Swiper
          onIndexChanged={(page) => {
            // dirty hack because of this issue
            // https://github.com/leecade/react-native-swiper/issues/1209
            setTimeout(() => {
              setCurrentIndex(page);
              firstTime && logEvents.logOnboardingSwipe(page);
            }, 0);
          }}
          loop={false}
          ref={swiperRef}
          // showsButtons
          activeDot={<ActiveDot />}>
          <Screen1 />
          <Screen2 />
          <Screen3 />
        </Swiper>
      </ScrollView>
      <View style={styles.CTAButtonContainer}>
        {currentIndex === 2 ? (
          firstTime ? (
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
                  <Text
                    onPress={onLegalMentionsClick}
                    style={styles.underlined}>
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
          ) : (
            <View style={styles.buttonWrapper}>
              <Button title="Terminer" onPress={navigation.goBack} />
            </View>
          )
        ) : (
          <View style={styles.buttonWrapper}>
            <Button title="Suivant" onPress={onPressNext} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  CTAButtonContainer: {},
  scrollContainer: {flex: 1},
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
    textAlign: 'center',
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
    fontSize: Dimensions.get('window').height > 600 ? 16 : 12,
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

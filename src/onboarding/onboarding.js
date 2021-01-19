import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {colors} from '../common/colors';
import localStorage from '../utils/localStorage';
import matomo from '../services/matomo';

const Onboarding = ({navigation}) => {
  const [isCguChecked, setIsCguChecked] = useState(false);

  const validateOnboarding = async () => {
    navigation.navigate('supported');
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
      <View style={styles.container}>
        <Text style={styles.message}>
          Pour <Text style={styles.emphasis}>suivre</Text> l’évolution de{' '}
          <Text style={styles.emphasis}>mes symptômes</Text>.
        </Text>
        <Text style={styles.message}>
          Pour partager au mieux avec les professionnels qui me suivent (
          <Text style={styles.emphasis}>psychiatres</Text>,{' '}
          <Text style={styles.emphasis}>psychologues</Text>,{' '}
          <Text style={styles.emphasis}>médecins généralistes</Text> …) et
          trouver les bonnes ressources pour aller mieux.
        </Text>
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
          <Text style={styles.label}>
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
        <View style={styles.container}>
          <TouchableOpacity
            disabled={!isCguChecked}
            onPress={validateOnboarding}
            style={styles.ValidationButton}>
            <Text style={styles.ValidationButtonText}>Commencer</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    flex: 1,
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
  message: {
    fontSize: 22,
    padding: 15,
  },
});

export default Onboarding;

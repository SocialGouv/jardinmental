import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Text from '../../../components/MyText';
import {colors} from '../../../utils/colors';
import localStorage from '../../../utils/localStorage';
import logEvents from '../../../services/logEvents';
import Matomo from '../../../services/matomo';
import {ONBOARDING_STEPS} from '../../../utils/constants';
import HandShakeSvg from '../../../../assets/svg/HandShake';

const Supported = ({navigation}) => {
  const handleClick = async (value) => {
    //send matomo
    logEvents.logSupportedSelect(value);
    Matomo.setUserProperties({
      supported: value,
    });
    //navigate to tabs
    navigation.navigate('onboarding-symptoms');
    //set local storage
    await localStorage.setSupported(value);
  };

  React.useEffect(() => {
    (async () => {
      await localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_SUPPORTED);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <HandShakeSvg width={88} height={88} color="#bebebe" />
          <Text style={styles.title}>Bienvenue sur{'\n'}Mon Suivi Psy</Text>
          <Text style={styles.subtitle}>Faisons connaissance :</Text>
        </View>
        <Card
          title="Je suis suivi, le professionnel qui me suit m'a recommandé l'application"
          color="#F4FCFD"
          handleClick={() => handleClick('YES')}
        />
        <Card
          title="Je suis suivi, j'ai téléchargé moi-même l'application"
          color="#F4FCFD"
          handleClick={() => handleClick('YES_SOLO')}
        />
        <Card
          title="Je ne suis pas suivi mais je le souhaite"
          color="#F4FCFD"
          handleClick={() => handleClick('NOT_YET')}
        />
        <Card
          title="Je ne suis pas suivi"
          color="#F4FCFD"
          handleClick={() => handleClick('NO')}
        />
        <DarkCard
          title="Je suis un professionnel de santé"
          color="#F4FCFD"
          handleClick={() => handleClick('PRO')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const Card = ({title, handleClick}) => {
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};
const DarkCard = ({title, handleClick}) => {
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={styles.darkCard}>
        <Text style={styles.darkCardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.LIGHT_BLUE,
    marginBottom: 20,
    borderRadius: 20,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: Dimensions.get('window').height > 700 ? 75 : 40,
    flex: 1,
  },
  darkCard: {
    backgroundColor: colors.DARK_BLUE,
    marginBottom: 20,
    borderRadius: 20,
    padding: 15,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 150,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  darkCardTitle: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    paddingBottom: 15,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.BLUE,
    paddingBottom: 10,
    fontWeight: 'normal',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    display: 'flex',
  },
});

export default Supported;

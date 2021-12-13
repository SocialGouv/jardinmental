import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import Matomo from '../../services/matomo';
import logEvents from '../../services/logEvents';
import {sendTipimail} from '../../services/sendTipimail';
import localStorage from '../../utils/localStorage';

export default () => {
  const [value, setValue] = useState();
  const [npsSent, setNpsSent] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    console.log('yo');
    (async () => {
      const supported = await localStorage.getSupported();
      console.log('✍️ ~ supported', supported);
      const npsProContact = await localStorage.getNpsProContact();
      console.log('✍️ ~ npsProContact', npsProContact);
      setVisible(supported === 'PRO' && !npsProContact);
    })();
  }, []);

  const formatText = ({value, userId}) => {
    let text = `User: ${userId}\n`;
    text += `Retour professionnel de santé : ${value}\n`;
    return text;
  };

  const sendNPS = async () => {
    if (npsSent) {
      return;
    }
    logEvents.logProNPSSend();
    const userId = Matomo.userId;
    await sendTipimail(
      {
        from: {
          address: 'contact@monsuivipsy.fr',
          personalName: 'MonSuiviPsy - Application',
        },
        subject: 'MonSuiviPsy - NPS Professionnel',
        text: formatText({value, userId}),
      },
      __DEV__ ? 'tangimds@gmail.com' : 'monsuivipsy@fabrique.social.gouv.fr',
    );
    setNpsSent(true);
  };

  return visible ? (
    <View style={styles.welcomeContainer}>
      <Text style={[styles.welcomeText, styles.boldText]}>
        Mon Suivi Psy est un service public développé avec des professionnels de
        santé et des patients
      </Text>
      <Text style={[styles.welcomeText, styles.boldText, styles.blueText]}>
        En tant que professionnel de santé, votre avis nous est particulièrement
        précieux.
      </Text>
      <Text style={styles.welcomeText}>
        Vous souhaitez nous aider à améliorer l’application ?{'\n'}
        Laissez-nous vos coordonnées (mail ou téléphone) afin que nous puissions
        vous contacter
      </Text>
      <TextInput
        style={styles.feedback}
        onChangeText={setValue}
        placeholder="Entrez votre adresse mail ou votre numéro de téléphone"
        value={value}
        textAlignVertical="top"
        returnKeyType="next"
      />
      <TouchableOpacity onPress={sendNPS} style={styles.button}>
        <Text style={styles.buttonText}>Valider</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setVisible(false)}
        style={styles.secondarybutton}>
        <Text style={styles.secondarybuttonText}>Passer cette étape</Text>
      </TouchableOpacity>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  feedback: {
    width: '100%',
    // height: 100,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: '#dbdbe9',
    backgroundColor: '#f3f3f6',
    padding: 15,
    marginVertical: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  notFound: {
    color: '#444',
    fontStyle: 'italic',
    fontWeight: '600',
    padding: 30,
  },
  welcomeContainer: {
    padding: 20,
    backgroundColor: '#F8F9FB',
    borderWidth: 1,
    borderColor: '#E7E9F1',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  welcomeText: {marginBottom: 30},
  boldText: {fontWeight: 'bold'},
  blueText: {color: colors.LIGHT_BLUE},
  showWelcomeView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 45,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flex: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Dimensions.get('window').width > 350 ? 17 : 13,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  secondarybutton: {
    marginTop: 45,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flex: 0,
  },
  secondarybuttonText: {
    textDecorationLine: 'underline',
    color: colors.DARK_BLUE,
    fontSize: Dimensions.get('window').width > 350 ? 14 : 10,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
});

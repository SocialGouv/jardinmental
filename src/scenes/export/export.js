import React, {useContext, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  ScrollView,
} from 'react-native';
import KeyboardAvoidingViewScreen from '../../components/KeyboardAvoidingViewScreen';
import Text from '../../components/MyText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExportDataSvg from '../../../assets/svg/export-data.svg';
import {colors} from '../../utils/colors';
import {DiaryDataContext} from '../../context/diaryData';
import {DiaryNotesContext} from '../../context/diaryNotes';
import {formatHtmlTable} from './utils';
import Icon from '../../components/Icon';
import logEvents from '../../services/logEvents';
import {sendTipimail} from '../../services/sendTipimail';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
const MailStorageKey = '@Mail';

const Export = ({navigation}) => {
  const [mail, setMail] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diaryData] = useContext(DiaryDataContext);
  const [diaryNotes] = useContext(DiaryNotesContext);

  useEffect(() => {
    (async () => {
      const storageMail = await AsyncStorage.getItem(MailStorageKey);
      if (storageMail) {
        setMail(storageMail.trim().replace(/\s*/g, ''));
      }
    })();
  }, []);

  const exportData = async () => {
    if (!mail)
      return Alert.alert(
        'Oups',
        `Aucun mail n'a été renseigné.\n\nMerci d'indiquer l'adresse mail sur laquelle vous désirez recevoir vos données.`,
      );
    await AsyncStorage.setItem(MailStorageKey, mail);
    const htmlExport = await formatHtmlTable(diaryData, diaryNotes);
    setIsLoading(true);
    logEvents.logDataExport();
    let subject = 'Export de données';
    if (pseudo) subject += ` - ${pseudo}`;
    const res = await sendTipimail(
      {
        from: {
          address: 'contact@monsuivipsy.fr',
          personalName: 'MonSuiviPsy - Application',
        },
        subject,
        html: htmlExport,
      },
      mail,
    );
    setIsLoading(false);
    if (res.ok) {
      Alert.alert(
        'Mail envoyé !',
        `Retrouvez vos données sur votre boîte mail : ${mail}`,
        [
          {
            text: 'Retour',
            onPress: () => navigation.navigate('tabs'),
            style: 'default',
          },
        ],
      );
    } else {
      console.log(res);
      Alert.alert("Une erreur s'est produite !");
    }
  };

  const handleChangeMail = (value) => {
    setMail(value.trim().replace(/\s*/g, ''));
  };
  const handleChangePseudo = (value) => {
    setPseudo(value.trim().replace(/\s*/g, ''));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.inner}>
          <BackButton onPress={navigation.goBack} />
          <Icon
            icon="ExportDataSvg"
            color="#d3d3e8"
            styleContainer={{
              marginTop: '20%',
              marginBottom: '20%',
            }}
            width={80}
            height={80}
          />
          <Text style={styles.title}>
            J'envoie par mail mes données des 30 derniers jours
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              Je souhaite envoyer mes données à :
            </Text>
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              onChangeText={handleChangeMail}
              value={mail}
              placeholder="destinataire@mail.com"
              style={styles.inputMail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Text style={styles.italic}>Optionnel</Text> : je peux donner un
              nom à mon bilan pour mieux l'identifier
            </Text>
            <TextInput
              autoCapitalize="none"
              onChangeText={handleChangePseudo}
              value={pseudo}
              placeholder="Ex: Arthur M. décembre 2020, ..."
              style={styles.inputMail}
            />
          </View>
          {!isLoading && (
            <Button
              title="Exporter mes données"
              disabled={!mail}
              onPress={exportData}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  icon: {
    margin: '20%',
  },
  container: {
    display: 'flex',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f9f9',
    height: '100%',
  },
  inner: {
    display: 'flex',
    flex: 1,
    paddingBottom: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    width: '80%',
    flexShrink: 0,
    textAlign: 'center',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '700',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    marginBottom: '20%',
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  inputMail: {
    textAlign: 'center',
    backgroundColor: '#F4FCFD',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: colors.LIGHT_BLUE,
    padding: 10,
  },
  label: {
    marginBottom: 5,
    color: colors.BLUE,
    textAlign: 'center',
  },
  inputContainer: {
    paddingHorizontal: 30,
    display: 'flex',
    alignSelf: 'stretch',
    marginVertical: 30,
  },
  italic: {
    fontStyle: 'italic',
  },
});

export default Export;

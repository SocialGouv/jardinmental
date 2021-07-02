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
import {DiaryDataContext} from '../../context';
import {formatHtmlTable} from './utils';
import Icon from '../../components/Icon';
import logEvents from '../../services/logEvents';
import {sendTipimail} from '../../services/sendTipimail';
import BackButton from '../../components/BackButton';
const MailStorageKey = '@Mail';

const Export = ({navigation}) => {
  const [mail, setMail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diaryData] = useContext(DiaryDataContext);

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
    const htmlExport = await formatHtmlTable(diaryData);
    setIsLoading(true);
    logEvents.logDataExport();
    const res = await sendTipimail(
      {
        from: {
          address: 'contact@monsuivipsy.fr',
          personalName: 'MonSuiviPsy - Application',
        },
        subject: 'Export de données',
        html: htmlExport,
      },
      mail,
    );
    setIsLoading(false);
    if (res.ok) {
      Alert.alert(
        'Mail envoyé !',
        `Retrouvez vos données sur votre boîte mail : ${mail}`,
      );
    } else {
      console.log(res);
      Alert.alert("Une erreur s'est produite !");
    }
  };

  const handleChangeMail = (value) => {
    setMail(value.trim().replace(/\s*/g, ''));
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
            Recevez vos données des 30 derniers jours par mail
          </Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={handleChangeMail}
            value={mail}
            placeholder="Renseignez votre email"
            style={styles.inputMail}
          />

          {!isLoading && (
            <TouchableOpacity onPress={exportData} style={styles.exportButton}>
              <Text style={styles.exportButtonText}>Exporter mes données</Text>
            </TouchableOpacity>
          )}
          <View style={{flex: 1}} />
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
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  exportButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  inputMail: {
    width: '75%',
    textAlign: 'center',
    backgroundColor: '#F4FCFD',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: colors.LIGHT_BLUE,
    marginVertical: '10%',
    padding: 10,
  },
});

export default Export;

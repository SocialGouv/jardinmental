import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExportData from '../../assets/svg/export-data.svg';
import {colors} from '../common/colors';
import {DiaryDataContext} from '../context';
import {formatHtmlTable} from './utils';

import matomo from '../services/matomo';
import {sendTipimail} from '../services/sendTipimail';
const MailStorageKey = '@Mail';

const Export = ({navigation}) => {
  const [mail, setMail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diaryData] = useContext(DiaryDataContext);

  useEffect(() => {
    (async () => {
      const storageMail = await AsyncStorage.getItem(MailStorageKey);
      if (storageMail) {
        setMail(storageMail);
      }
    })();
  }, []);

  const onBackPress = navigation.goBack;

  const exportData = async () => {
    await AsyncStorage.setItem(MailStorageKey, mail);
    const htmlExport = await formatHtmlTable(diaryData);
    setIsLoading(true);
    matomo.logDataExport();
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <View style={styles.inner}>
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.backButtonContainer}>
            <Text style={styles.backButton}>Retour</Text>
          </TouchableOpacity>
          <ExportData style={styles.icon} />
          <Text style={styles.title}>
            Recevez vos données des 30 derniers jours par mail
          </Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            onChangeText={setMail}
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
        </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 30,
    backgroundColor: '#f9f9f9',
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
    borderRadius: 10,
    marginVertical: '10%',
    padding: 10,
  },
});

export default Export;

import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExportData from '../../assets/svg/export-data.svg';
import {colors} from '../common/colors';
import {DiaryDataContext} from '../context';
import {formatHtmlTable} from './utils';

import {
  TIPIMAIL_API_KEY,
  TIPIMAIL_API_USER,
  TIPIMAIL_FROM_MAIL,
  TIPIMAIL_FROM_NAME,
} from '@env';
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
    const htmlExport = formatHtmlTable(diaryData);
    setIsLoading(true);
    const res = await fetch('https://api.tipimail.com/v1/messages/send', {
      method: 'POST',
      headers: {
        'X-Tipimail-ApiUser': TIPIMAIL_API_USER,
        'X-Tipimail-ApiKey': TIPIMAIL_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        apiKey: TIPIMAIL_API_KEY,
        to: [
          {
            address: mail,
          },
        ],
        msg: {
          from: {
            address: TIPIMAIL_FROM_MAIL,
            personalName: TIPIMAIL_FROM_NAME,
          },
          subject: 'Export de données',
          html: htmlExport,
        },
      }),
    }).catch((err) => console.log('sendNPS err', err));
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
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  icon: {
    margin: '20%',
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    height: '100%',
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
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginBottom: '20%',
    marginTop: 20,
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

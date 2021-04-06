import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {colors} from '../common/colors';
import localStorage from '../utils/localStorage';
import logEvents from '../services/logEvents';
import Matomo from '../services/matomo';
import {useEffect} from 'react';
import Button from '../common/button';

const Supported = ({navigation}) => {
  const [contribution, setContribution] = useState('');
  const [npsSent, setNpsSent] = useState(false);
  const [sendButton, setSendButton] = useState('Valider');

  const sendNPS = async () => {
    if (npsSent) {
      return;
    }
    const {useful, reco, feedback, email} = this.state;
    setSendButton('Merci !');
    logEvents.logNPSSend(useful, reco);
    const userId = Matomo.userId;
    sendTipimail(
      {
        from: {
          address: 'contact@monsuivipsy.fr',
          personalName: 'MonSuiviPsy - Application',
        },
        subject: 'MonSuiviPsy - NPS',
        text: formatText(useful, reco, feedback, email, userId),
      },
      __DEV__ ? 'tangimds@gmail.com' : 'monsuivipsy@fabrique.social.gouv.fr',
    );
    this.npsSent = true;
    this.setState({visible: false});
  };

  const onBackPress = () => navigation.goBack();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <TouchableOpacity
          onPress={onBackPress}
          style={styles.backButtonContainer}>
          <Text style={styles.backButton}>{'Retour'}</Text>
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Suivi Psy</Text>
          <Text style={styles.title}>Nous vous écoutons :</Text>
        </View>
        <View style={styles.textArea}>
          <TextInput
            multiline={true}
            numberOfLines={6}
            onChangeText={setContribution}
            value={contribution}
            placeholder="Message..."
            textAlignVertical="top"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button onPress={sendNPS} title={sendButton} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 30,
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginTop: 20,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  card: {
    borderWidth: 1,
    marginBottom: 30,
    borderRadius: 10,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '20%',
  },
  cardTitle: {
    color: colors.DARK_BLUE,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardSubTitle: {
    color: colors.DARK_BLUE,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    paddingBottom: 20,
    fontWeight: '700',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
  },
  content: {
    display: 'flex',
    flex: 1,
  },
  textArea: {
    backgroundColor: '#F4FCFD',
    height: '50%',
    borderColor: '#26387C',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});

export default Supported;

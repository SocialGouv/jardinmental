import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import localStorage from '../../utils/localStorage';
import logEvents from '../../services/logEvents';
import Matomo from '../../services/matomo';
import {useEffect} from 'react';
import Button from '../../components/Button';
import BackButton from '../../components/BackButton';
import {sendMail} from '../../services/mail';

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
    sendMail({
      subject: 'Jardin Mental - NPS',
      text: formatText(useful, reco, feedback, email, userId),
    });
    this.npsSent = true;
    this.setState({visible: false});
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} keyboardDismissMode="on-drag" onScrollBeginDrag={Keyboard.dismiss}>
        <BackButton />
        <View style={styles.header}>
          <Text style={styles.title}>Jardin Mental</Text>
          <Text style={styles.title}>Nous vous écoutons :</Text>
        </View>
        <View style={styles.textArea}>
          <TextInput multiline={true} numberOfLines={6} onChangeText={setContribution} value={contribution} placeholder="Message..." textAlignVertical="top" />
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
    borderColor: colors.BLUE,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
});

export default Supported;

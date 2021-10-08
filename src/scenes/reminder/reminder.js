import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Text from '../../components/MyText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReminderSvg from '../../../assets/svg/reminder.js';
import TimePicker from '../../components/timePicker';
import NotificationService from '../../services/notifications';
import {colors} from '../../utils/colors';
import logEvents from '../../services/logEvents';
import BackButton from '../../components/BackButton';

const dateWithTimeAndOffsetFromToday = (hours, minutes, offset) => {
  const date = new Date();
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + offset,
    hours,
    minutes,
  );
};

const timeIsAfterNow = (inputDate) => {
  const date = new Date(inputDate);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  if (hours > new Date().getHours()) {
    return true;
  }
  if (hours < new Date().getHours()) {
    return false;
  }
  return minutes > new Date().getMinutes();
};

const ReminderStorageKey = '@Reminder';
const reminderTitle = "C'est l'heure de noter vos symptômes !";
const reminderMessage =
  "N'oubliez pas de remplir votre application Mon Suivi Psy";
class Reminder extends React.Component {
  state = {
    reminder: null,
    timePickerVisible: false,
  };

  componentDidMount() {
    this.getReminder(false);
    this.notifcationListener = NotificationService.listen(
      this.handleNotification,
    );
  }

  componentWillUnmount() {
    NotificationService.remove(this.notifcationListener);
  }

  onOK = () => {
    this.props.navigation.navigate('tabs');
  };

  onBackPress = () => this.props.navigation.navigate('tabs');

  goToNextOnboardingScreen = () =>
    this.props.navigation.navigate('symptoms', {onboarding: true});

  getReminder = async (showAlert = true) => {
    const isRegistered = await NotificationService.checkPermission();
    const reminder = await AsyncStorage.getItem(ReminderStorageKey);
    if (Boolean(reminder) && new Date(reminder) === 'Invalid Date') {
      this.deleteReminder();
      return;
    }
    if (!isRegistered && reminder && showAlert) {
      this.showPermissionsAlert(this.deleteReminder);
    }
    if (!reminder) {
      return;
    }
    this.setState({reminder: new Date(reminder)});
  };

  scheduleNotification = async (
    reminder = new Date(Date.now() + 10 * 1000),
  ) => {
    NotificationService.cancelAll();
    for (let i = !timeIsAfterNow(reminder); i <= 15; i++) {
      const fireDate = dateWithTimeAndOffsetFromToday(
        reminder.getHours(),
        reminder.getMinutes(),
        i,
      );
      NotificationService.scheduleNotification({
        date: fireDate,
        title: reminderTitle,
        message: reminderMessage,
      });
    }
    logEvents.logReminderAdd();
  };

  showTimePicker = async () => {
    const isRegistered = await NotificationService.checkPermission();
    if (!isRegistered) {
      this.showPermissionsAlert(this.deleteReminder);
      return;
    }
    this.setState({timePickerVisible: true});
  };

  showPermissionsAlert = (deleteReminder) => {
    // Alert.
    Alert.alert(
      'Vous devez autoriser les notifications pour accéder à ce service',
      'Veuillez cliquer sur Réglages puis Notifications pour activer les notifications',
      [
        {
          text: 'Réglages',
          onPress: () => Linking.openURL('app-settings:'),
        },
        {
          text: 'Annuler',
          onPress: deleteReminder,
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  setReminder = async (reminder) => {
    if (!reminder) {
      this.setState({timePickerVisible: false});
      return;
    }
    await AsyncStorage.setItem(ReminderStorageKey, reminder.toISOString());
    await this.scheduleNotification(reminder);
    this.setState({reminder, timePickerVisible: false});
  };

  deleteReminderManually = () => {
    logEvents.logReminderCancel();
    this.deleteReminder();
  };

  deleteReminder = async () => {
    await AsyncStorage.removeItem(ReminderStorageKey);
    NotificationService.cancelAll();
    this.setState({reminder: null, timePickerVisible: false});
  };

  handleNotification = (notification) => {
    if (!notification) {
      return;
    }
    if (Platform.OS === 'android') {
      if (notification.title === reminderTitle) {
        this.onOK();
      }
    }
    if (Platform.OS === 'ios') {
      if (notification.message === reminderMessage) {
        this.onOK();
      }
    }
  };

  renderHeader = () => {
    return this.props.route?.params?.onboarding ? (
      <>
        <View style={styles.header}>
          <ReminderSvg style={styles.smallImage} height={40} width={40} />
          <Text style={styles.smallTitle}>
            À quelle heure souhaitez-vous remplir votre journal ?
          </Text>
        </View>
        <Text style={styles.subTitle}>
          Vous serez notifié(e) à cette heure pour remplir votre journal.
        </Text>
      </>
    ) : (
      <>
        <ReminderSvg style={styles.bigImage} />
        <Text style={styles.bigTitle}>
          N'oubliez plus jamais de remplir votre journal
        </Text>
      </>
    );
  };

  render() {
    const {reminder, timePickerVisible} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <BackButton onPress={this.onBackPress} />
        {this.renderHeader()}
        <View style={styles.description}>
          {reminder ? (
            <>
              <Text style={styles.subTitle}>Vous avez défini un rappel à</Text>
              <TouchableOpacity onPress={this.showTimePicker}>
                <Text style={styles.time}>{`${reminder.getLocalePureTime(
                  'fr',
                )}`}</Text>
              </TouchableOpacity>
              <Text style={styles.subTitle}>tous les jours.</Text>
            </>
          ) : (
            <>
              <Text style={styles.subTitle}>
                Définissez un rappel quotidien sur votre téléphone pour vous
                rappeler
              </Text>
            </>
          )}
        </View>
        <TouchableOpacity
          onPress={this.showTimePicker}
          style={styles.setupButton}>
          <Text style={styles.setupButtonText}>
            {reminder ? 'Modifier le rappel' : 'Définir un rappel'}
          </Text>
        </TouchableOpacity>
        {this.props.route?.params?.onboarding ? (
          <TouchableOpacity
            onPress={this.onBackPress}
            style={reminder ? styles.setupButton : {}}>
            <Text style={reminder ? styles.setupButtonText : styles.later}>
              {reminder ? 'Continuer' : 'Plus tard, peut-être'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={reminder ? this.deleteReminderManually : this.onBackPress}>
            <Text style={styles.later}>
              {reminder ? 'Retirer le rappel' : 'Plus tard, peut-être'}
            </Text>
          </TouchableOpacity>
        )}
        <TimePicker
          value={reminder}
          visible={timePickerVisible}
          selectDate={this.setReminder}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  smallImage: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },
  bigImage: {
    color: '#C3C7D5',
    height: 40,
    width: 40,
    marginVertical: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 100,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
    height: '100%',
  },
  bigTitle: {
    width: '80%',
    flexShrink: 0,
    textAlign: 'center',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '700',
    marginTop: '10%',
  },
  smallTitle: {
    width: '80%',
    flexShrink: 0,
    textAlign: 'left',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '700',
  },
  description: {
    width: '80%',
    marginTop: '10%',
    marginBottom: '20%',
  },
  subTitle: {
    flexShrink: 0,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  time: {
    fontWeight: '700',
    fontSize: 19,
    textAlign: 'center',
    paddingVertical: 10,
  },
  buttons: {
    justifyContent: 'space-around',
    marginVertical: 15,
    marginBottom: '20%',
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
  later: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  setupButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
});

export default Reminder;

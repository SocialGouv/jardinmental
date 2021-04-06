import React from 'react';
import {
  Alert,
  Linking,
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReminderSvg from '../../assets/svg/reminder.svg';
import TimePicker from './time-picker';
import NotificationService from '../services/notifications';
import {colors} from '../common/colors';
import logEvents from '../services/logEvents';

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
const reminderMessage = "N'oubliez pas de remplir votre Mon Suivi Psy";
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

  onBackPress = this.props.navigation.goBack;

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

  render() {
    const {reminder, timePickerVisible} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          onPress={this.onBackPress}
          style={styles.backButtonContainer}>
          <Text style={styles.backButton}>{'Retour'}</Text>
        </TouchableOpacity>
        <ReminderSvg />
        <Text style={styles.title}>
          N'oubliez plus jamais de noter vos symptômes
        </Text>
        <View style={styles.description}>
          {reminder ? (
            <>
              <Text style={styles.subTitle}>Vous avez défini un rappel à</Text>
              <Text style={styles.time}>{`${reminder.getLocalePureTime(
                'fr',
              )}`}</Text>
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
        <TouchableOpacity
          onPress={reminder ? this.deleteReminderManually : this.onBackPress}>
          <Text style={styles.later}>
            {reminder ? 'Retirer le rappel' : 'Plus tard, peut-être'}
          </Text>
        </TouchableOpacity>
        <TimePicker visible={timePickerVisible} selectDate={this.setReminder} />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
    marginTop: '10%',
  },
  description: {
    width: '80%',
    marginTop: '10%',
    marginBottom: '20%',
  },
  subTitle: {
    flexShrink: 0,
    textAlign: 'center',
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

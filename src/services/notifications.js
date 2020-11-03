import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class NotificationService {
  listeners = {};

  init = async () => {
    await this.configure();
  };

  async configure() {
    PushNotification.configure({
      onNotification: this.handleNotification,
      onRegister: () => null,
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: false,
      requestPermissions: Platform.OS === 'ios',
    });
    // required for android
    PushNotification.createChannel(
      {
        channelId: 'REMINDER-CHANNEL-ID', // (required)
        channelName: 'Reminder notifications', // (required)
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    this.isConfigured = true;
  }

  getInitNotification() {
    PushNotification.popInitialNotification((notification) => {
      console.log('Initial Notification', notification);
      this.handleNotification(notification);
    });
  }
  //Appears after a specified time. App does not have to be open.
  scheduleNotification({
    date,
    title,
    message,
    playSound = true,
    soundName = 'default',
    channelId = 'REMINDER-CHANNEL-ID', // same as in strings.xml, for Android
  } = {}) {
    PushNotification.localNotificationSchedule({
      date,
      title,
      message,
      playSound,
      soundName,
      channelId,
    });
  }

  async checkPermission() {
    return await new Promise((resolve) => {
      PushNotification.checkPermissions(({ alert }) => {
        resolve(alert);
      });
    });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  handleNotification = (notification) => {
    console.log('Initial Notification', notification);
    const listenerKeys = Object.keys(this.listeners);
    //  handle initial notification if any, if no listener is mounted yet
    if (!listenerKeys.length) {
      this.initNotification = notification;
      notification.finish();
      return;
    }
    this.initNotification = null;

    //handle normal notification
    for (let i = listenerKeys.length - 1; i >= 0; i--) {
      const notificationHandler = this.listeners[listenerKeys[i]];
      notificationHandler(notification);
    }
    notification.finish();
  };

  listen = (callback) => {
    const listenerKey = `listener_${Date.now()}`;
    this.listeners[listenerKey] = callback;
    if (this.initNotification) this.handleNotification(this.initNotification);
    return listenerKey;
  };

  remove = (listenerKey) => {
    delete this.listeners[listenerKey];
  };
}

const Notifications = new NotificationService();

export default Notifications;

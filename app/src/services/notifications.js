import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { Platform } from "react-native";
import { checkNotifications, RESULTS } from "react-native-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  STORAGE_KEY_PUSH_NOTIFICATION_TOKEN,
  STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR,
} from "../utils/constants";
import logEvents from "./logEvents";

class NotificationService {
  listeners = {};
  listeners = {};

  init = () => {
    this.configure();
  };

  delete = () => {
    PushNotificationIOS.removeEventListener("registrationError", this.failIOSToken);
  };

  async configure() {
    this.initChannels();
    if (Platform.OS === "ios") {
      PushNotificationIOS.addEventListener("registrationError", this.onIOSRegistrationError);
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  onRegister = (tokenPayload) => {
    console.log("PushNotification onRegister:", tokenPayload);
    AsyncStorage.setItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN, tokenPayload.token);
    AsyncStorage.removeItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR);
    logEvents.logPushNotifTokenRegisterSuccess();
  };
  onRegistrationError = (err) => {
    console.error("PushNotification onRegistrationError:", err.message, err);
    AsyncStorage.setItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR, err.message);
    logEvents.logPushNotifTokenRegisterError();
  };

  onIOSRegistrationError = (err) => {
    if (Platform.OS === "android") return;
    console.error("PushNotification onRegistrationError:", err.message, err);
    AsyncStorage.setItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR, err.message);
    logEvents.logPushNotifTokenRegisterError();
  };

  initChannels() {
    this.initDefaultChannel();
  }

  checkPermission = async () => {
    const authStatus = await checkNotifications().then(({ status }) => status);
    // …'unavailable' | 'denied' | 'limited' | 'granted' | 'blocked'
    let permission = { granted: false, canAsk: false };
    switch (authStatus) {
      case RESULTS.UNAVAILABLE:
        permission = { granted: false, canAsk: false };
        break;
      case RESULTS.DENIED:
        permission = { granted: false, canAsk: true };
        break;
      case RESULTS.LIMITED:
        permission = { granted: true };
        break;
      case RESULTS.GRANTED:
        permission = { granted: true };
        break;
      case RESULTS.BLOCKED:
        permission = { granted: false, canAsk: false };
        break;
    }
    return permission;
  };

  checkAndAskForPermission = async () => {
    const { granted, canAsk } = await this.checkPermission();
    if (granted) return true;
    if (!canAsk) return false;
    const permission = await PushNotification.requestPermissions();
    return permission;
  };

  checkAndGetPermissionIfAlreadyGiven = async (from) => {
    const { granted } = await this.checkPermission();
    if (!granted) return true;
    const permission = await PushNotification.requestPermissions();
    return permission;
  };
  // LOCAL NOTIFICATIONS

  channelId = "REMINDER-CHANNEL-ID"; // same as in strings.xml, for Android
  initDefaultChannel = () => {
    PushNotification.createChannel(
      {
        channelId: this.channelId, // (required)
        channelName: "Push local notifications", // (required)
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  };

  //Appears after a specified time. App does not have to be open.
  scheduleNotification({
    date,
    title,
    message,
    playSound = true,
    soundName = "default",
    repeatType = "day",
  } = {}) {
    PushNotification.localNotificationSchedule({
      date,
      title,
      message,
      playSound,
      soundName,
      channelId: this.channelId,
      repeatType,
    });
  }
  getScheduledLocalNotifications = () =>
    new Promise((resolve) => PushNotification.getScheduledLocalNotifications(resolve));
  localNotification({ title, message, playSound = true, soundName = "default" } = {}) {
    PushNotification.localNotification({
      title,
      message,
      playSound,
      soundName,
      channelId: this.channelId,
    });
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }

  // PUSH NOTIFICATIONS
  getInitNotification() {
    PushNotification.popInitialNotification((notification) => {
      console.log("Initial Notification", notification);
      this.handleNotification(notification);
    });
  }

  handleNotification = (notification) => {
    console.log("handle Notification", JSON.stringify(notification, null, 2));

    logEvents.logPushNotifReceiveClicked();

    /* ANDROID FOREGROUND */

    // if (Platform.OS === "android") {
    //   // if not the line below, the notification is launched without notifying
    //   // with the line below, there is a local notification triggered
    //   if (notification.foreground && !notification.userInteraction) return;
    // }

    /* LISTENERS */

    const listenerKeys = Object.keys(this.listeners);
    // handle initial notification if any, if no listener is mounted yet
    if (!listenerKeys.length) {
      this.initNotification = notification;
      notification.finish(PushNotificationIOS.FetchResult.NoData);
      return;
    }
    this.initNotification = null;

    //handle normal notification
    for (let i = listenerKeys.length - 1; i >= 0; i--) {
      const notificationHandler = this.listeners[listenerKeys[i]];
      notificationHandler(notification);
    }
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  };

  popInitialNotification = () => {
    const initialNotification = this.initNotification;
    this.initNotification = null;
    return initialNotification;
  };

  subscribe = (callback) => {
    let listenerKey = null;
    while (!listenerKey) {
      listenerKey = parseInt(Math.random() * 9999).toString();
      if (this.listeners.hasOwnProperty(listenerKey)) {
        listenerKey = null;
      }
    }
    this.listeners[listenerKey] = callback;
    return () => {
      delete this.listeners[listenerKey];
    };
  };

  listen = (callback, calledFrom) => {
    // const listenerKey = `listener_${calledFrom}`;
    // this.listeners[listenerKey] = callback;
    // if (this.initNotification) this.handleNotification(this.initNotification);
    // return listenerKey;
  };

  remove = (listenerKey) => {
    delete this.listeners[listenerKey];
  };

  getToken = async () => {
    return await AsyncStorage.getItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN, null);
  };

  hasToken = async () => {
    return (await AsyncStorage.getItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN, null)) !== null;
  };

  getTokenError = async () => {
    return await AsyncStorage.getItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR, null);
  };
}

const service = new NotificationService();

PushNotification.configure({
  onNotification: service.handleNotification.bind(service),
  onRegister: service.onRegister.bind(service),
  onRegistrationError: service.onRegistrationError.bind(service),

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: false,
});

export default service;

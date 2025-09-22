import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY_PUSH_NOTIFICATION_TOKEN, STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR } from "../utils/constants";
import logEvents from "./logEvents";
import API from "./api";
import { registerForPushNotificationsAsync } from "./notifications-expo";
import uuid from "react-native-uuid";
import NotificationEncryption from "../utils/notificationEncryption";
import hybridNotificationHandler from "./hybridNotificationHandler";

class NotificationService {
  listeners = {};

  init = async () => {
    await this.configure();
    // Initialize hybrid notification handler
    await hybridNotificationHandler.initialize();
  };

  delete = () => {
    // Clean up if needed
  };

  async configure() {
    this.initChannels();
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  onRegister = (tokenPayload) => {
    (async () => {
      const oldToken = await AsyncStorage.getItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN);
      console.log("PushNotification onRegister newToken:", tokenPayload.token, "oldToken:", oldToken);
      if (oldToken) {
        await API.put({
          path: "/reminder/refreshPushNotifToken",
          body: {
            oldPushNotifToken: oldToken,
            newPushNotifToken: tokenPayload.token,
          },
        });
      }
      AsyncStorage.setItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN, tokenPayload.token);
      AsyncStorage.removeItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR);
      logEvents.logPushNotifTokenRegisterSuccess();
    })();
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
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("reminder_main", {
        name: "Rappel questionnaire",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      });

      Notifications.setNotificationChannelAsync("reminder_goal", {
        name: "Rappel d'objectif",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      });

      Notifications.setNotificationChannelAsync("reminder_inactivity", {
        name: "Rappel d'inactivité",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      });

      Notifications.setNotificationChannelAsync(this.channelId, {
        name: "Autres",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: "default",
      });
    }
  }

  async checkPermission() {
    const { status } = await Notifications.getPermissionsAsync();
    return status === "granted";
  }

  async checkAndAskForPermission() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === "granted";
    }
    return true;
  }

  checkAndGetPermissionIfAlreadyGiven = async (from) => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus !== "granted") return false;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  };
  channelId = "REMINDER-CHANNEL-ID";

  scheduleNotification({ date, title, message, playSound = true, soundName = "default", repeatType = "day" } = {}) {
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        sound: playSound ? soundName : null,
        android: {
          channelId: this.channelId,
        },
      },
      trigger: {
        date,
        repeats: repeatType === "day",
      },
    });
  }

  getScheduledLocalNotifications = async () => {
    return await Notifications.getAllScheduledNotificationsAsync();
  };

  localNotification({ title, message, playSound = true, soundName = "default" } = {}) {
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        sound: playSound ? soundName : null,
        android: {
          channelId: this.channelId,
        },
      },
      trigger: null,
    });
  }

  cancelAll() {
    Notifications.cancelAllScheduledNotificationsAsync();
  }

  getInitNotification() {
    // Will be handled by Expo's notification listeners
    // unused
  }

  handleNotification = async (notification) => {
    console.log("handle Notification", JSON.stringify(notification, null, 2));
    logEvents.logPushNotifReceiveClicked();

    // Process notification for decryption if needed
    const processedNotification = await NotificationEncryption.processNotificationForDisplay(notification);

    // Log decryption status
    if (processedNotification.wasEncrypted) {
      console.log("Notification was encrypted, decryption status:", processedNotification.decrypted);
      if (processedNotification.decrypted) {
        console.log("Decrypted notification:", {
          title: processedNotification.title,
          body: processedNotification.body,
        });
      } else {
        console.warn("Failed to decrypt notification:", processedNotification.error);
      }
    }

    // Use processed notification for listeners
    const notificationToPass = {
      ...notification,
      decryptedContent: processedNotification,
    };

    const listenerKeys = Object.keys(this.listeners);
    if (!listenerKeys.length) {
      this.initNotification = notificationToPass;
      return;
    }
    this.initNotification = null;

    for (let i = listenerKeys.length - 1; i >= 0; i--) {
      const notificationHandler = this.listeners[listenerKeys[i]];
      notificationHandler(notificationToPass);
    }
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
    // Keeping the commented out code as is
    // unused
  };

  remove = (listenerKey) => {
    delete this.listeners[listenerKey];
  };

  async getToken() {
    try {
      let deviceId = await AsyncStorage.getItem("deviceId");
      if (!deviceId) {
        deviceId = uuid.v4();
        await AsyncStorage.setItem("deviceId", deviceId);
      }

      const token = await registerForPushNotificationsAsync({ userId: deviceId });
      return token;
    } catch (error) {
      console.error("Error getting push token:", error);
      return null;
    }
  }

  async hasToken() {
    const token = await this.getToken();
    return !!token;
  }

  getTokenError = async () => {
    return await AsyncStorage.getItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN_ERROR, null);
  };
}

const service = new NotificationService();

// Configure Expo notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Set up notification listeners
Notifications.addNotificationReceivedListener(service.handleNotification);
Notifications.addNotificationResponseReceivedListener((response) => {
  service.handleNotification(response.notification);
});

export default service;

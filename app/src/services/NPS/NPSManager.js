import AsyncStorage from "@react-native-async-storage/async-storage";
import Notifications from "../notifications";
import logEvents from "../logEvents";

const NPSTimeoutMS = __DEV__ ? 1000 * 3 : 1000 * 60 * 60 * 24 * 10;

const STORE_KEYS = {
  NPS_DONE: "@NPSDone",
  INITIAL_OPENING: "@NPSInitialOpening",
  NPS_SCHEDULING_IN_PROGRESS: "@NPSSchedulingInProgress",
};

const captions = {
  notifTitle: "Vos retours sont importants pour nous",
  notifMessage: "Avez-vous quelques secondes pour donner votre avis ?",
};

const getCaption = (key) => captions[key];

class NPSManager {
  constructor() {
    this.isInitialized = false;
    this.isSchedulingInProgress = false;
    this.shouldShowNPS = false;
    this.listeners = new Set();
  }

  // Singleton pattern
  static getInstance() {
    if (!NPSManager.instance) {
      NPSManager.instance = new NPSManager();
    }
    return NPSManager.instance;
  }

  // Initialize the NPS manager - should be called once when app starts
  async initialize() {
    if (this.isInitialized) {
      return;
    }

    try {
      // Clean up any stale scheduling flag on app start
      await AsyncStorage.removeItem(STORE_KEYS.NPS_SCHEDULING_IN_PROGRESS);

      await this.checkNeedNPS();
      this.isInitialized = true;
    } catch (error) {
      console.error("NPSManager initialization error:", error);
    }
  }

  // Add a listener for NPS state changes
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify all listeners of state changes
  notifyListeners(shouldShow) {
    this.listeners.forEach((callback) => {
      try {
        callback(shouldShow);
      } catch (error) {
        console.error("NPSManager listener error:", error);
      }
    });
  }

  // Check if NPS should be shown and handle notification scheduling
  async checkNeedNPS() {
    try {
      // Check if NPS is already done
      const NPSDone = await AsyncStorage.getItem(STORE_KEYS.NPS_DONE);
      if (NPSDone) {
        return false;
      }

      // Check if scheduling is already in progress (race condition protection)
      const schedulingInProgress = await AsyncStorage.getItem(STORE_KEYS.NPS_SCHEDULING_IN_PROGRESS);
      if (schedulingInProgress && !this.isSchedulingInProgress) {
        // Another instance is handling scheduling, wait for it to complete
        return false;
      }

      const appFirstOpening = await AsyncStorage.getItem(STORE_KEYS.INITIAL_OPENING);

      // Skip in development mode
      if (__DEV__) {
        return false;
      }

      // First time opening the app
      if (!appFirstOpening) {
        await this.scheduleFirstTimeNotification();
        return false;
      }

      // Check if enough time has passed since first opening
      const opening = await AsyncStorage.getItem(STORE_KEYS.INITIAL_OPENING);
      const timeForNPS = Date.now() - Date.parse(new Date(opening)) > NPSTimeoutMS;

      if (timeForNPS) {
        // Time to show NPS
        logEvents.logNPSOpen();
        await AsyncStorage.setItem(STORE_KEYS.NPS_DONE, "true");
        this.shouldShowNPS = true;
        this.notifyListeners(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error("NPSManager checkNeedNPS error:", error);
      return false;
    }
  }

  // Schedule notification for first time users
  async scheduleFirstTimeNotification() {
    try {
      // Set flag to prevent race conditions
      this.isSchedulingInProgress = true;
      await AsyncStorage.setItem(STORE_KEYS.NPS_SCHEDULING_IN_PROGRESS, "true");

      // Double-check that we haven't already scheduled
      const alreadyScheduled = await AsyncStorage.getItem(STORE_KEYS.INITIAL_OPENING);
      if (alreadyScheduled) {
        // Another instance already handled this
        await AsyncStorage.removeItem(STORE_KEYS.NPS_SCHEDULING_IN_PROGRESS);
        this.isSchedulingInProgress = false;
        return;
      }

      // Set the initial opening date
      await AsyncStorage.setItem(STORE_KEYS.INITIAL_OPENING, new Date().toISOString());

      // Schedule the notification
      await Notifications.scheduleNotification({
        date: new Date(Date.now() + NPSTimeoutMS),
        title: getCaption("notifTitle"),
        message: getCaption("notifMessage"),
      });

      // Clear the scheduling flag
      await AsyncStorage.removeItem(STORE_KEYS.NPS_SCHEDULING_IN_PROGRESS);
      this.isSchedulingInProgress = false;

      console.log("NPS notification scheduled successfully");
    } catch (error) {
      console.error("NPSManager scheduleFirstTimeNotification error:", error);
      // Clean up on error
      await AsyncStorage.removeItem(STORE_KEYS.NPS_SCHEDULING_IN_PROGRESS);
      this.isSchedulingInProgress = false;
    }
  }

  // Check if NPS should be shown (for components to call)
  getShouldShowNPS() {
    return this.shouldShowNPS;
  }

  // Mark NPS as completed
  async markNPSCompleted() {
    try {
      await AsyncStorage.setItem(STORE_KEYS.NPS_DONE, "true");
      this.shouldShowNPS = false;
      this.notifyListeners(false);
    } catch (error) {
      console.error("NPSManager markNPSCompleted error:", error);
    }
  }

  // Reset NPS (for development/testing)
  async reset() {
    try {
      await AsyncStorage.removeItem(STORE_KEYS.NPS_DONE);
      await AsyncStorage.removeItem(STORE_KEYS.INITIAL_OPENING);
      await AsyncStorage.removeItem(STORE_KEYS.NPS_SCHEDULING_IN_PROGRESS);
      this.shouldShowNPS = false;
      this.isInitialized = false;
      this.isSchedulingInProgress = false;
      this.notifyListeners(false);
    } catch (error) {
      console.error("NPSManager reset error:", error);
    }
  }

  // Handle notification tap
  handleNotification(notification) {
    if (notification.title === getCaption("notifTitle") && notification.userInteraction === true) {
      this.shouldShowNPS = true;
      this.notifyListeners(true);
      return true;
    }
    return false;
  }
}

export default NPSManager.getInstance();

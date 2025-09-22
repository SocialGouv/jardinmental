import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { AppState } from "react-native";
import NotificationEncryption from "../utils/notificationEncryption";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Hybrid Notification Handler
 *
 * This service handles different types of notifications in the hybrid approach:
 * 1. Regular encrypted notifications (current approach)
 * 2. Silent notifications that trigger local notifications
 * 3. Enhanced background processing with better timing
 */

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND_NOTIFICATION_TASK";

class HybridNotificationHandler {
  constructor() {
    this.isInitialized = false;
    this.notificationQueue = [];
    this.processingTimeout = null;
  }

  /**
   * Initialize the hybrid notification handler
   */
  async initialize() {
    if (this.isInitialized) return;

    try {
      // Register background task for notification processing
      await this.registerBackgroundTask();

      // Set up notification handlers
      this.setupNotificationHandlers();

      // Set up app state change listener
      this.setupAppStateListener();

      this.isInitialized = true;
      console.log("HybridNotificationHandler initialized successfully");
    } catch (error) {
      console.error("Failed to initialize HybridNotificationHandler:", error);
    }
  }

  /**
   * Register background task for notification processing
   */
  async registerBackgroundTask() {
    try {
      // Define the background task
      TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
        if (error) {
          console.error("Background notification task error:", error);
          return;
        }

        if (data) {
          console.log("Background notification task received data:", data);
          this.processBackgroundNotification(data);
        }
      });

      // Check if task is already registered
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_NOTIFICATION_TASK);
      if (!isRegistered) {
        console.log("Registering background notification task");
        // Note: This would require additional setup in app.json for background tasks
        // For now, we'll rely on Expo's built-in notification handling
      }
    } catch (error) {
      console.warn("Background task registration failed (this is expected in development):", error);
    }
  }

  /**
   * Set up notification handlers
   */
  setupNotificationHandlers() {
    // Configure notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const shouldProcess = await this.shouldProcessNotificationInBackground(notification);

        return {
          shouldShowAlert: !shouldProcess, // Don't show alert if we're processing in background
          shouldPlaySound: !shouldProcess,
          shouldSetBadge: true,
        };
      },
    });

    // Handle received notifications (including silent ones)
    Notifications.addNotificationReceivedListener(async (notification) => {
      await this.handleReceivedNotification(notification);
    });

    // Handle notification responses (user tapped notification)
    Notifications.addNotificationResponseReceivedListener(async (response) => {
      await this.handleNotificationResponse(response);
    });
  }

  /**
   * Set up app state change listener
   */
  setupAppStateListener() {
    AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        // Process any queued notifications when app becomes active
        this.processQueuedNotifications();
      }
    });
  }

  /**
   * Determine if notification should be processed in background
   */
  async shouldProcessNotificationInBackground(notification) {
    try {
      const data = notification.request?.content?.data || {};

      // Check if it's a silent notification
      if (data.silentDecryption === true) {
        return true;
      }

      // Check if it has background processing hint
      if (data.backgroundProcessingHint === true) {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking background processing:", error);
      return false;
    }
  }

  /**
   * Handle received notification
   */
  async handleReceivedNotification(notification) {
    try {
      const data = notification.request?.content?.data || {};

      console.log("Received notification:", {
        title: notification.request?.content?.title,
        silent: data.silentDecryption,
        encrypted: data.encrypted,
        appState: AppState.currentState,
      });

      // Handle silent notifications
      if (data.silentDecryption === true) {
        await this.handleSilentNotification(notification);
        return;
      }

      // Handle regular notifications with background processing hint
      if (data.backgroundProcessingHint === true) {
        await this.handleEnhancedNotification(notification);
        return;
      }

      // Regular notification processing (existing behavior)
      console.log("Processing regular notification");
    } catch (error) {
      console.error("Error handling received notification:", error);
    }
  }

  /**
   * Handle silent notification - decrypt and create local notification
   */
  async handleSilentNotification(notification) {
    try {
      const data = notification.request?.content?.data || {};

      console.log("Processing silent notification for local replacement");

      // Extract original content from silent notification
      const originalTitle = data.originalTitle;
      const originalBody = data.originalBody;
      const notificationType = data.notificationType || "general";

      if (!originalTitle || !originalBody) {
        console.warn("Silent notification missing original content");
        return;
      }

      // Create notification data for decryption
      const notificationData = {
        title: originalTitle,
        body: originalBody,
        data: data,
      };

      // Decrypt the content
      const decryptedNotification = await NotificationEncryption.decryptNotification(notificationData);

      // Create local notification with decrypted content
      await this.createLocalNotification({
        title: decryptedNotification.title,
        body: decryptedNotification.body,
        data: {
          ...data,
          decrypted: decryptedNotification.decrypted,
          wasEncrypted: decryptedNotification.wasEncrypted,
          processedBySilentHandler: true,
        },
      });

      console.log("Silent notification processed and local notification created");
    } catch (error) {
      console.error("Error processing silent notification:", error);

      // Fallback: create generic local notification
      await this.createLocalNotification({
        title: "Nouvelle notification",
        body: "Ouvrez l'application pour voir le détail",
        data: { fallback: true },
      });
    }
  }

  /**
   * Handle enhanced notification with optimized background processing
   */
  async handleEnhancedNotification(notification) {
    try {
      const data = notification.request?.content?.data || {};
      const timeout = data.decryptionTimeout || 3000;

      console.log("Processing enhanced notification with background optimization");

      // Set up timeout for background processing
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve({ timedOut: true }), timeout);
      });

      // Process notification with timeout
      const decryptionPromise = NotificationEncryption.processNotificationForDisplay(notification);

      const result = await Promise.race([decryptionPromise, timeoutPromise]);

      if (result.timedOut) {
        console.warn("Background decryption timed out, using fallback");
        // Queue for processing when app becomes active
        this.queueNotification(notification);
      } else {
        console.log("Enhanced background processing completed:", {
          decrypted: result.decrypted,
          wasEncrypted: result.wasEncrypted,
        });

        // Store processed notification for immediate access
        await this.storeProcessedNotification(notification.request.identifier, result);
      }
    } catch (error) {
      console.error("Error in enhanced notification processing:", error);
      this.queueNotification(notification);
    }
  }

  /**
   * Handle notification response (user tapped notification)
   */
  async handleNotificationResponse(response) {
    try {
      const notification = response.notification;
      const data = notification.request?.content?.data || {};

      console.log("User tapped notification:", {
        identifier: notification.request.identifier,
        encrypted: data.encrypted,
        processed: data.processedBySilentHandler,
      });

      // If notification was processed by silent handler, no additional processing needed
      if (data.processedBySilentHandler) {
        console.log("Notification already processed by silent handler");
        return;
      }

      // Check if we have a pre-processed version
      const processed = await this.getProcessedNotification(notification.request.identifier);
      if (processed) {
        console.log("Using pre-processed notification content");
        // Use the pre-processed content
        return;
      }

      // Process notification normally
      const processedNotification = await NotificationEncryption.processNotificationForDisplay(notification);
      console.log("Processed notification on tap:", {
        decrypted: processedNotification.decrypted,
        wasEncrypted: processedNotification.wasEncrypted,
      });
    } catch (error) {
      console.error("Error handling notification response:", error);
    }
  }

  /**
   * Create local notification
   */
  async createLocalNotification({ title, body, data = {} }) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: "default",
        },
        trigger: null, // Show immediately
      });

      console.log("Local notification created:", { title, body });
    } catch (error) {
      console.error("Error creating local notification:", error);
    }
  }

  /**
   * Queue notification for later processing
   */
  queueNotification(notification) {
    this.notificationQueue.push({
      notification,
      timestamp: Date.now(),
    });

    // Limit queue size
    if (this.notificationQueue.length > 10) {
      this.notificationQueue.shift();
    }

    console.log(`Queued notification, queue size: ${this.notificationQueue.length}`);
  }

  /**
   * Process queued notifications
   */
  async processQueuedNotifications() {
    if (this.notificationQueue.length === 0) return;

    console.log(`Processing ${this.notificationQueue.length} queued notifications`);

    const notifications = [...this.notificationQueue];
    this.notificationQueue = [];

    for (const item of notifications) {
      try {
        // Skip notifications older than 5 minutes
        if (Date.now() - item.timestamp > 5 * 60 * 1000) {
          console.log("Skipping old queued notification");
          continue;
        }

        const processed = await NotificationEncryption.processNotificationForDisplay(item.notification);
        console.log("Processed queued notification:", {
          decrypted: processed.decrypted,
          wasEncrypted: processed.wasEncrypted,
        });
      } catch (error) {
        console.error("Error processing queued notification:", error);
      }
    }
  }

  /**
   * Store processed notification for quick access
   */
  async storeProcessedNotification(identifier, processedData) {
    try {
      const key = `processed_notification_${identifier}`;
      await AsyncStorage.setItem(
        key,
        JSON.stringify({
          ...processedData,
          storedAt: Date.now(),
        })
      );

      // Clean up old stored notifications
      this.cleanupStoredNotifications();
    } catch (error) {
      console.error("Error storing processed notification:", error);
    }
  }

  /**
   * Get processed notification
   */
  async getProcessedNotification(identifier) {
    try {
      const key = `processed_notification_${identifier}`;
      const stored = await AsyncStorage.getItem(key);

      if (stored) {
        const data = JSON.parse(stored);

        // Check if data is still fresh (within 1 hour)
        if (Date.now() - data.storedAt < 60 * 60 * 1000) {
          return data;
        } else {
          // Remove expired data
          await AsyncStorage.removeItem(key);
        }
      }

      return null;
    } catch (error) {
      console.error("Error getting processed notification:", error);
      return null;
    }
  }

  /**
   * Clean up old stored notifications
   */
  async cleanupStoredNotifications() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const notificationKeys = keys.filter((key) => key.startsWith("processed_notification_"));

      for (const key of notificationKeys) {
        const stored = await AsyncStorage.getItem(key);
        if (stored) {
          const data = JSON.parse(stored);
          // Remove notifications older than 1 hour
          if (Date.now() - data.storedAt > 60 * 60 * 1000) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error("Error cleaning up stored notifications:", error);
    }
  }

  /**
   * Process background notification (called by background task)
   */
  async processBackgroundNotification(data) {
    try {
      console.log("Processing notification in background task");

      // This would be called by the background task
      // For now, we'll queue it for processing when app becomes active
      this.queueNotification(data.notification);
    } catch (error) {
      console.error("Error in background notification processing:", error);
    }
  }

  /**
   * Get handler statistics
   */
  getStatistics() {
    return {
      isInitialized: this.isInitialized,
      queuedNotifications: this.notificationQueue.length,
      appState: AppState.currentState,
    };
  }

  /**
   * Reset handler state
   */
  reset() {
    this.notificationQueue = [];
    if (this.processingTimeout) {
      clearTimeout(this.processingTimeout);
      this.processingTimeout = null;
    }
  }
}

// Create singleton instance
const hybridNotificationHandler = new HybridNotificationHandler();

export default hybridNotificationHandler;

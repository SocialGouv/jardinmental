import CryptoJS from "crypto-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEY_PUSH_NOTIFICATION_TOKEN } from "./constants";

/**
 * Client-side Notification Encryption Utility
 *
 * This module provides decryption functionality for encrypted push notifications.
 * It mirrors the server-side encryption logic to decrypt notifications received
 * from the push notification service.
 *
 * Features:
 * - Decrypts notifications using user-specific keys
 * - Handles background decryption for notification extensions
 * - Provides fallback messages for failed decryption
 * - Caches decrypted content for performance
 */

class NotificationEncryption {
  /**
   * Generate a user-specific encryption key from their push token
   * @param {string} pushToken - User's push notification token
   * @returns {string} - Derived encryption key
   */
  static generateUserKey(pushToken) {
    if (!pushToken) {
      throw new Error("Push token is required for key generation");
    }

    // Use PBKDF2 to derive a key from the push token
    // This must match the server-side implementation exactly
    const salt = "jardinmental_notification_salt_2024";
    const key = CryptoJS.PBKDF2(pushToken, salt, {
      keySize: 256 / 32,
      iterations: 1000,
    });

    return key.toString();
  }

  /**
   * Decrypt notification content
   * @param {object} encryptedPayload - The encrypted payload
   * @param {string} pushToken - User's push notification token
   * @returns {string} - Decrypted content or fallback message
   */
  static decryptContent(encryptedPayload, pushToken) {
    try {
      if (!encryptedPayload || !encryptedPayload.isEncrypted) {
        return encryptedPayload?.content || encryptedPayload;
      }

      const key = this.generateUserKey(pushToken);
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedPayload.encrypted, key);
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        throw new Error("Decryption resulted in empty string");
      }

      const payload = JSON.parse(decryptedText);

      // Validate timestamp (reject messages older than 24 hours)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (Date.now() - payload.timestamp > maxAge) {
        throw new Error("Message too old");
      }

      return payload.content;
    } catch (error) {
      console.error("Decryption failed:", error);
      // Return generic message if decryption fails
      return this.getGenericMessage(encryptedPayload);
    }
  }

  /**
   * Get a generic fallback message when decryption fails
   * @param {object} encryptedPayload - The encrypted payload
   * @returns {string} - Generic message
   */
  static getGenericMessage(encryptedPayload) {
    const type = encryptedPayload?.type;

    // Return different generic messages based on context
    if (type === "reminder_main") {
      return "Vous avez un nouveau rappel";
    } else if (type === "reminder_goal") {
      return "Rappel d'objectif";
    } else if (type === "reminder_inactivity") {
      return "Rappel d'activité";
    }
    return "Nouvelle notification";
  }

  /**
   * Decrypt a complete notification payload
   * @param {object} notificationData - Notification data from push service
   * @param {string} pushToken - User's push notification token (optional, will fetch if not provided)
   * @returns {Promise<object>} - Decrypted notification payload
   */
  static async decryptNotification(notificationData, pushToken = null) {
    try {
      // Get push token if not provided
      if (!pushToken) {
        pushToken = await AsyncStorage.getItem(STORAGE_KEY_PUSH_NOTIFICATION_TOKEN);
        if (!pushToken) {
          console.warn("No push token available for decryption");
          return {
            title: notificationData.title || "Notification",
            body: notificationData.body || "Nouvelle notification",
            decrypted: false,
            error: "no_push_token",
          };
        }
      }

      // Check if notification is encrypted
      if (!notificationData.data?.encrypted) {
        return {
          title: notificationData.title,
          body: notificationData.body,
          decrypted: true,
          wasEncrypted: false,
        };
      }

      // Decrypt title and body
      const decryptedTitle = this.decryptContent(notificationData.data.encryptedTitle, pushToken);
      const decryptedBody = this.decryptContent(notificationData.data.encryptedBody, pushToken);

      return {
        title: decryptedTitle,
        body: decryptedBody,
        decrypted: true,
        wasEncrypted: true,
        type: notificationData.data.type,
      };
    } catch (error) {
      console.error("Failed to decrypt notification:", error);

      // Return fallback content
      return {
        title: this.getGenericMessage({ type: notificationData.data?.type }),
        body: "Ouvrez l'application pour voir le détail",
        decrypted: false,
        error: error.message,
        wasEncrypted: true,
      };
    }
  }

  /**
   * Process notification for display (handles both encrypted and plain notifications)
   * @param {object} notification - Raw notification object
   * @returns {Promise<object>} - Processed notification ready for display
   */
  static async processNotificationForDisplay(notification) {
    try {
      // Extract notification data
      const notificationData = {
        title: notification.request?.content?.title || notification.title,
        body: notification.request?.content?.body || notification.body,
        data: notification.request?.content?.data || notification.data || {},
      };

      // Decrypt if needed
      const decryptedNotification = await this.decryptNotification(notificationData);

      return {
        ...decryptedNotification,
        originalNotification: notification,
        processedAt: Date.now(),
      };
    } catch (error) {
      console.error("Failed to process notification:", error);

      // Return safe fallback
      return {
        title: "Notification",
        body: "Nouvelle notification disponible",
        decrypted: false,
        error: error.message,
        originalNotification: notification,
        processedAt: Date.now(),
      };
    }
  }

  /**
   * Cache decrypted notification content for performance
   * @param {string} notificationId - Unique notification identifier
   * @param {object} decryptedContent - Decrypted notification content
   */
  static async cacheDecryptedContent(notificationId, decryptedContent) {
    try {
      const cacheKey = `decrypted_notification_${notificationId}`;
      const cacheData = {
        ...decryptedContent,
        cachedAt: Date.now(),
      };

      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));

      // Clean up old cache entries (older than 24 hours)
      this.cleanupOldCache();
    } catch (error) {
      console.error("Failed to cache decrypted content:", error);
    }
  }

  /**
   * Retrieve cached decrypted content
   * @param {string} notificationId - Unique notification identifier
   * @returns {Promise<object|null>} - Cached content or null if not found/expired
   */
  static async getCachedDecryptedContent(notificationId) {
    try {
      const cacheKey = `decrypted_notification_${notificationId}`;
      const cachedData = await AsyncStorage.getItem(cacheKey);

      if (!cachedData) {
        return null;
      }

      const parsed = JSON.parse(cachedData);

      // Check if cache is still valid (24 hours)
      const maxAge = 24 * 60 * 60 * 1000;
      if (Date.now() - parsed.cachedAt > maxAge) {
        await AsyncStorage.removeItem(cacheKey);
        return null;
      }

      return parsed;
    } catch (error) {
      console.error("Failed to retrieve cached content:", error);
      return null;
    }
  }

  /**
   * Clean up old cached entries
   */
  static async cleanupOldCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const notificationCacheKeys = keys.filter((key) => key.startsWith("decrypted_notification_"));

      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      const keysToRemove = [];

      for (const key of notificationCacheKeys) {
        try {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            if (Date.now() - parsed.cachedAt > maxAge) {
              keysToRemove.push(key);
            }
          }
        } catch (error) {
          // If we can't parse the data, remove it
          keysToRemove.push(key);
        }
      }

      if (keysToRemove.length > 0) {
        await AsyncStorage.multiRemove(keysToRemove);
        console.log(`Cleaned up ${keysToRemove.length} old notification cache entries`);
      }
    } catch (error) {
      console.error("Failed to cleanup old cache:", error);
    }
  }
}

export default NotificationEncryption;

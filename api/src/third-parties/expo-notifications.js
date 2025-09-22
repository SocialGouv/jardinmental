const { Expo } = require("expo-server-sdk");
const NotificationEncryption = require("../utils/encryption");

let expo = new Expo({
  accessToken: process.env.EXPO_ACCESS_TOKEN,
  useFcmV1: true,
});

const sendNotifications = async ({
  pushTokens,
  title,
  body,
  type = "general",
  enableEncryption = true,
  silent = false,
  priority = "normal",
  backgroundProcessingHint = false,
  decryptionTimeout = 3000,
  data = {},
}) => {
  const uniqueTokens = [...new Set(pushTokens)];
  let messages = [];
  for (let pushToken of uniqueTokens) {
    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    let notificationPayload = { title, body };
    let notificationData = { ...data };

    // Handle silent notifications
    if (silent) {
      notificationPayload.title = null;
      notificationPayload.body = null;
    }

    // Encrypt notification if enabled
    if (enableEncryption && !silent) {
      try {
        const encryptedNotification = NotificationEncryption.encryptNotification({ title, body }, pushToken, type);

        // Use encrypted content for the notification
        notificationPayload = {
          title: encryptedNotification.encrypted ? encryptedNotification.titleFallback : title,
          body: encryptedNotification.encrypted ? encryptedNotification.bodyFallback : body,
        };

        // Add encrypted data to custom payload for client-side decryption
        notificationData = {
          ...notificationData,
          encrypted: encryptedNotification.encrypted,
          encryptedTitle: encryptedNotification.title,
          encryptedBody: encryptedNotification.body,
          type: type,
          version: "1.0",
          backgroundProcessingHint,
          decryptionTimeout,
        };
      } catch (error) {
        console.error("Failed to encrypt notification, sending plain text:", error);
        notificationData = {
          ...notificationData,
          encrypted: false,
          type: type,
          backgroundProcessingHint,
        };
      }
    } else {
      notificationData = {
        ...notificationData,
        encrypted: false,
        type: type,
        backgroundProcessingHint,
      };
    }

    // Build message object
    const message = {
      to: pushToken,
      data: notificationData,
    };

    // Add title and body for non-silent notifications
    if (!silent) {
      message.title = notificationPayload.title;
      message.body = notificationPayload.body;
      message.sound = "default";
    }

    // Add priority if specified
    if (priority === "high") {
      message.priority = "high";
      message.channelId = type; // Use type as channel ID for high priority
    }

    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push(message);
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  // Send the chunks to the Expo push notification service. There are
  // different strategies you could use. A simple one is to send one chunk at a
  // time, which nicely spreads the load out over time:
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      // console.log(ticketChunk);
      tickets.push(...ticketChunk);

      // NOTE: If a ticket contains an error code in ticket.details.error, you
      // must handle it appropriately. The error codes are listed in the Expo
      // documentation:
      // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
    } catch (error) {
      console.error(error);
    }
  }
};

module.exports = { sendNotifications };

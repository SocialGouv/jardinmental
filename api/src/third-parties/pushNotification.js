const PushNotifications = require("node-pushnotifications");
const { PUSH_NOTIFICATION_GCM_ID, PUSH_NOTIFICATION_APN_KEY, PUSH_NOTIFICATION_APN_KEY_ID, PUSH_NOTIFICATION_APN_TEAM_ID } = require("../config");
const matomo = require("./matomo");

const push = new PushNotifications({
  gcm: {
    id: PUSH_NOTIFICATION_GCM_ID,
  },
  apn: {
    token: {
      key: PUSH_NOTIFICATION_APN_KEY.replace(/\\n/g, "\n"),
      keyId: PUSH_NOTIFICATION_APN_KEY_ID,
      teamId: PUSH_NOTIFICATION_APN_TEAM_ID,
    },
  },
});

const sendNotification = async ({ pushNotifToken, title, body, link, channelId }) => {
  const data = {
    title,
    body,
    topic: "org.reactjs.native.example.monsuivipsy",
    android_channel_id: channelId,
    custom: {
      link,
    },
  };
  await matomo.logEvent({
    category: "PUSH_NOTIFICATION_SEND",
    action: "SENDING",
  });

  try {
    const results = await push.send([pushNotifToken], data);
    if (results.length > 0) {
      if (results[0].success) {
        await matomo.logEvent({
          category: "PUSH_NOTIFICATION_SEND",
          action: "SUCCESS",
        });
      } else if (results[0].failure) {
        console.log("push notification sent failure:", results[0].message?.[0]?.errorMsg);
        await matomo.logEvent({
          category: "PUSH_NOTIFICATION_SEND",
          action: "FAILED",
          name: results[0].message?.[0]?.errorMsg,
        });
        return { ok: false, results };
      }
    }
    return { ok: true, results };
  } catch (error) {
    await matomo.logEvent({
      category: "PUSH_NOTIFICATION_SEND",
      action: "ERROR",
    });
    return { ok: false, error };
  }
};

module.exports = {
  sendNotification,
};

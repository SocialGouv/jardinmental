const PushNotifications = require("node-pushnotifications");
const { PUSH_NOTIFICATION_GCM_ID } = require("../config");

const push = new PushNotifications({
  gcm: {
    id: PUSH_NOTIFICATION_GCM_ID,
  },
  apn: {
    token: {
      key: "./certs/key.p8",
      keyId: "ABCD",
      teamId: "EFGH",
    },
  },
});

const sendNotification = async ({ pushNotifToken, title, body, topic, link }) => {
  const data = {
    title,
    body,
    topic,
    custom: {
      link,
    },
  };
  //console.log("notif push : sending...", pushNotifToken, data);

  try {
    const results = await push.send([pushNotifToken], data);
    //console.log("notif push sent", results);
    return { ok: true, results };
  } catch (error) {
    //console.error("notif push error", error);
    return { ok: false, error };
  }
};

module.exports = {
  sendNotification,
};

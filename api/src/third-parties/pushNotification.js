const PushNotifications = require("node-pushnotifications");

const push = new PushNotifications({
  gcm: {
    id: "AAAA9U3NkO8:APA91bE9XnPD1WQGYle0dbJs6KO6HmAq_73f_z2PHoPr3sbRovXbn9q-PyJAKYlxgNI88rBpTzNWCXRuxhX9FcwbDBhT4h0BAiJr4BiEx8uSkWHXM92q04Q6cydK-dHGSnR20bsgH0Lg",
  },
  apn: {
    token: {
      key: "./certs/key.p8",
      keyId: "ABCD",
      teamId: "EFGH",
    },
  },
});

const sendNotification = async ({ pushNotifToken, title, body, clickAction, topic }) => {
  const data = {
    title,
    body,
    clickAction,
    topic,
  };
  console.log("notif push : sending...", pushNotifToken, data);

  // try {
  //   const results = await push.send([pushNotifToken], data);
  //   debug("Results for sending notifications:", results);
  //   return results;
  // } catch (err) {
  //   debug("Error while sending notifications:", err);
  //   throw err;
  // }
};

module.exports = {
  sendNotification,
};

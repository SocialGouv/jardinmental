import API, { checkNetwork } from "./api";

export const sendMail = async (msg, toAddress) => {
  const canFetch = await checkNetwork();
  if (!canFetch) return { ok: false, skipMessage: true };

  return await API.post({
    path: "/mail",
    body: {
      to: toAddress,
      replyTo: msg?.replyTo?.address,
      replyToName: msg?.replyTo?.personalName,
      subject: msg?.subject,
      text: msg?.text,
      html: msg?.html,
    },
  }).catch((err) => console.log("send mail err", err));
};

import API, { checkNetwork } from "./api";

export const sendMail = async (msg, address) => {
  const canFetch = await checkNetwork();
  if (!canFetch) return { ok: false, skipMessage: true };

  return await API.post({
    path: "/mail",
    body: {
      to: address,
      from: msg?.from?.address,
      fromName: msg?.from?.personalName,
      subject: msg?.subject,
      text: msg?.text,
      html: msg?.html,
    },
  }).catch((err) => console.log("send mail err", err));
};

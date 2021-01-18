import {TIPIMAIL_API_KEY, TIPIMAIL_API_USER} from '@env';

export const sendTipimail = async (msg, address) => {
  return await fetch('https://api.tipimail.com/v1/messages/send', {
    method: 'POST',
    headers: {
      'X-Tipimail-ApiUser': TIPIMAIL_API_USER,
      'X-Tipimail-ApiKey': TIPIMAIL_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: TIPIMAIL_API_KEY,
      to: [
        {
          address,
        },
      ],
      msg,
    }),
  }).catch((err) => console.log('send tipimail err', err));
};

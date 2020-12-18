import {TIPIMAIL_API_KEY, TIPIMAIL_API_USER} from '@env';

export const sendTipimail = async (msg, address) => {
  return await fetch('https://api.tipimail.com/v1/messages/send', {
    method: 'POST',
    headers: {
      'X-Tipimail-ApiUser': '2fbfeec4905f352f871b2590da840571',
      'X-Tipimail-ApiKey': 'e94f70b1c2dd423a446efbbc788200cb',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      apiKey: 'e94f70b1c2dd423a446efbbc788200cb',
      to: [
        {
          address,
        },
      ],
      msg,
    }),
  }).catch((err) => console.log('send tipimail err', err));
};

import {Alert} from 'react-native';

export const toggleSelectedInArray = (array, elem) => {
  const res = [...array];
  const i = array.indexOf(elem);
  if (i !== -1) {
    res.splice(i, 1);
  } else {
    res.push(elem);
  }
  return res;
};

export const toggleState = (v, f) => f(!v);

export const confirm = ({
  title,
  message = '',
  onConfirm,
  onCancel,
  confirmText = 'Oui',
  cancelText = 'Non',
}) => {
  Alert.alert(title, message, [
    {
      text: confirmText,
      onPress: onConfirm,
      style: 'default',
    },
    {
      text: cancelText,
      onPress: onCancel,
      style: 'cancel',
    },
  ]);
};

export const deleteBeckfromDiaryData = ({
  date,
  beckId,
  diaryData,
  setDiaryData,
}) => {
  if (!date || !beckId) return;
  const survey = diaryData[date];
  const becks = survey?.becks;
  delete becks[beckId];
  setDiaryData({
    date,
    answers: {
      ...survey?.answers,
      becks,
    },
  });
};

import { Alert } from "react-native";

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

export const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

export const confirm = ({ title, message = "", onConfirm, onCancel, confirmText = "Oui", cancelText = "Non" }) => {
  Alert.alert(title, message, [
    {
      text: confirmText,
      onPress: onConfirm,
      style: "default",
    },
    {
      text: cancelText,
      onPress: onCancel,
      style: "cancel",
    },
  ]);
};

export const deleteBeckfromDiaryData = ({ date, beckId, diaryData, setDiaryData }) => {
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

export const getScoreWithState = ({ patientState, category }) => {
  if (
    patientState[category]?.value !== undefined &&
    patientState[category]?.value !== null &&
    !(typeof patientState[category]?.value === "number" && isFinite(patientState[category]?.value))
  )
    return;

  if (patientState[category]?.value) return patientState[category]?.value;

  // -------
  // the following code is for the retrocompatibility
  // -------

  // if the patient state doesnt have any info on question 1, return
  if (!patientState[category]) {
    return;
  }
  const [categoryName, suffix] = category.split("_");

  // if it is a 1 question category, return the level of the question
  if (!suffix) {
    return patientState[category].level;
  } else {
    // else if there is 2 question...

    // if it is never, the score is max, we dont look at the intensity,
    // i.e. 5
    if (patientState[category].id === "NEVER") {
      return 5;
    }

    // else we compute both frequence & intensity
    const frequence = patientState[category];
    const intensity = patientState[`${categoryName}_INTENSITY`];
    return frequence.level + intensity.level - 1;
  }
};

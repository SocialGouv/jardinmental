export const firstLetterUppercase = (inputString) => inputString.charAt(0).toUpperCase() + inputString.slice(1);

export const areStringArraysIdentical = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false;

  const sorted1 = [...arr1].sort((a, b) => a.localeCompare(b));
  const sorted2 = [...arr2].sort((a, b) => a.localeCompare(b));

  return sorted1.every((value, index) => value === sorted2[index]);
};

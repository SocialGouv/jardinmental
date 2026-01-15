export const firstLetterUppercase = (inputString) => inputString.charAt(0).toUpperCase() + inputString.slice(1);

export const areStringArraysIdentical = (arr1: string[], arr2: string[]) => {
  if (arr1.length !== arr2.length) return false;

  const sorted1 = [...arr1].sort((a, b) => a.localeCompare(b));
  const sorted2 = [...arr2].sort((a, b) => a.localeCompare(b));

  return sorted1.every((value, index) => value === sorted2[index]);
};

/**
 * Format phone number with a space every two digits.
 * If the number starts with a country code (e.g., +33), format as "+33 6 62 57 48 26".
 * For local 10-digit numbers, format as "06 62 57 48 26".
 * Otherwise, return the number as-is.
 */
export function formatPhoneNumber(number: string): string {
  // Remove all spaces for processing
  const clean = number.replace(/\s+/g, "");

  if (clean.startsWith("+")) {
    // Determine country code length based on total length
    // e.g. +33662574826 (12) => +33, +123662574826 (13) => +123
    let codeLength = 2; // default: +X
    if (clean.length === 12) codeLength = 3; // +XX
    if (clean.length === 13) codeLength = 4; // +XXX

    const code = clean.slice(0, codeLength);
    const rest = clean.slice(codeLength);

    // For French numbers, if the rest starts with '0', remove it (e.g., +33 06... => +33 6...)
    const restNoZero = code === "+33" && rest[0] === "0" ? rest.substring(1) : rest;

    if (restNoZero.length > 0) {
      const firstDigit = restNoZero[0];
      const remaining = restNoZero.slice(1);
      const formattedRest = remaining.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
      return `${code} ${firstDigit}${formattedRest ? " " + formattedRest : ""}`;
    }
    return code;
  }

  // Local 10-digit number
  if (/^\d{10}$/.test(clean)) {
    return clean.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
  }
  // Fallback: return as-is
  return number;
}

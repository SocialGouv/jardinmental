import crypto from "crypto-js";
import { HMAC_SECRET } from "../config";

export const generateHMAC = (payload) => {
  const timestamp = Date.now().toString();
  const dataToSign = `${timestamp}:${JSON.stringify(payload)}`;
  const signature = crypto.HmacSHA256(dataToSign, HMAC_SECRET).toString();

  return { signature, timestamp };
};

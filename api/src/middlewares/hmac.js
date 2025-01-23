const crypto = require("crypto");
const { HMAC_SECRET } = require("../config");

const validateHMAC = (req, res, next) => {
  const secret = HMAC_SECRET;
  if (!secret) {
    return next();
  }
  const { "x-signature": signature, "x-timestamp": timestamp } = req.headers;

  if (!signature || !timestamp) {
    return res.status(400).json({ error: "Missing signature or timestamp" });
  }

  const now = Date.now();
  if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
    // Vérifie un délai de 5 minutes
    return res.status(400).json({ error: "Timestamp expired" });
  }

  const payload = JSON.stringify(req.body);
  const dataToSign = `${timestamp}:${payload}`;
  const expectedSignature = crypto.createHmac("sha256", secret).update(dataToSign).digest("hex");

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  next();
};

module.exports = { validateHMAC };

const rateLimit = require("express-rate-limit");

// Middleware de rate limiting pour la route /reminder
const reminderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 10, // Maximum de 10 requêtes dans cette période
  keyGenerator: (req) => req.body.pushNotifToken || req.ip, // Limite basée sur pushNotifToken ou IP
  message: {
    ok: false,
    error: "Too many requests. Please try again later.",
  },
});

// Middleware de rate limiting pour la route /mail
const mailLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // Fenêtre de 1 minute
  max: 5, // Maximum de 5 mails par minute
  keyGenerator: (req) => req.ip, // Limite basée sur l'IP uniquement
  message: {
    ok: false,
    error: "Too many emails sent. Please wait a moment and try again.",
  },
});

module.exports = { reminderLimiter, mailLimiter };

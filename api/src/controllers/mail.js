const express = require("express");
const fetch = require("node-fetch");
const { TIPIMAIL_API_USER, TIPIMAIL_API_KEY, ENVIRONMENT } = require("../config");
const { catchErrors } = require("../middlewares/errors");
const router = express.Router();
const { capture } = require("../third-parties/sentry");
const { validateHMAC } = require("../middlewares/hmac");
const { mailLimiter } = require("../middlewares/rateLimit");

router.post(
  "/",
  validateHMAC,
  mailLimiter,
  catchErrors(async (req, res) => {
    let { to, replyTo, replyToName, subject, text, html } = req.body || {};

    if (!subject || (!text && !html)) return res.status(400).json({ ok: false, error: "wrong parameters" });

    if (!to) {
      to = ENVIRONMENT === "development" ? process.env.MAIL_TO_DEV : "jardinmental@fabrique.social.gouv.fr";
    }

    if (!replyTo) {
      replyTo = undefined;
      replyToName = undefined;
    }

    const from = "contact@jardinmental.fr";
    const fromName = "Jardin Mental - Application";

    const apiRes = await fetch("https://api.tipimail.com/v1/messages/send", {
      method: "POST",
      headers: {
        "X-Tipimail-ApiUser": TIPIMAIL_API_USER,
        "X-Tipimail-ApiKey": TIPIMAIL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: TIPIMAIL_API_KEY,
        to: [
          {
            address: to,
          },
        ],
        msg: {
          from: {
            address: from,
            personalName: fromName,
          },
          replyTo: replyTo && {
            address: replyTo,
            personalName: replyToName,
          },
          subject,
          text,
          html,
        },
      }),
    }).catch((err) => capture(err, { extra: { route: "POST /mail", body: req.body } }));

    if (apiRes?.ok) {
      return res.status(200).json({ ok: true });
    }

    return res.status(500).json({ ok: false, error: "error while sending email" });
  })
);

router.post("/subscribe", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const apiRes = await fetch("https://api.tipimail.com/v1/messages/send", {
      method: "POST",
      headers: {
        "X-Tipimail-ApiUser": TIPIMAIL_API_USER,
        "X-Tipimail-ApiKey": TIPIMAIL_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey: TIPIMAIL_API_KEY,
        to: [
          {
            address: "jardinmental@fabrique.social.gouv.fr",
          },
        ],
        msg: {
          from: {
            address: "contact@jardinmental.fr",
            personalName: "Jardin Mental - Application",
          },
          subject: "Nouvelle inscription à la newsletter",
          text: `Nouvelle inscription à la newsletter de l'application Jardin Mental : ${email}`,
        },
      }),
    }).catch((err) => capture(err, { extra: { route: "POST /mail/subscribe", body: req.body } }));

    if (apiRes?.ok) {
      return res.status(200).json({ message: "Subscription successful" });
    }

    res.status(200).json({ ok: true, message: "Subscription successful" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = { router };

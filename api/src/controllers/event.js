const express = require("express");
const { catchErrors } = require("../middlewares/errors");
const { capture } = require("../third-parties/sentry");
const router = express.Router();

/*
sendInApp example:
[
        "Attention !",
        "Ça ne va pas le faire",
        [
          {
            text: "Pourquoi ?",
            navigate: ["HEALTH"],
          },
          {
            text: "Comment ?",
            navigate: ["CONSO_FOLLOW_UP"],
            style: "destructive",
            event: { category: "IN_APP_CLICK", action: "COMMENT_CLICK" },
          },
        ],
        { cancelable: true },
      ]

*/

router.post(
  "/",
  catchErrors(async (req, res) => {
    const { body } = req;
    req.user = { userId: req.body.userId }; // for log in sentry

    const appversion = Number(req.headers?.appversion ?? 0);
    const appdevice = req.headers?.appdevice;

    if (appversion < 154 && ((body.event?.category === "OPEN_TAB" && body.event?.action === "EXPORT_OPEN") || body.event?.category === "NPS")) {
      return res.status(200).send({
        ok: true,
        sendInApp: [
          "L'envoi d'email n'est plus disponible sur cette version d'application",
          "Mettez à jour votre application !",
          [
            {
              text: "Mettre à jour",
              link:
                appdevice === "ios"
                  ? "https://apps.apple.com/us/app/mon-suivi-psy/id1540061393"
                  : "https://play.google.com/store/apps/details?id=com.monsuivipsy",
            },
          ],
          { cancelable: true },
        ],
      });
    }

    // todo : activate once the app is deployed

    // if (appversion < 207 && ((body.event?.category === "OPEN_TAB" && body.event?.action === "EXPORT_OPEN") || body.event?.category === "NPS")) {
    //   return res.status(200).send({
    //     ok: true,
    //     sendInApp: [
    //       "L'envoi d'email n'est plus disponible sur cette version d'application",
    //       "Mettez à jour votre application !",
    //       [
    //         {
    //           text: "Mettre à jour",
    //           link:
    //             appdevice === "ios"
    //               ? "https://apps.apple.com/us/app/mon-suivi-psy/id1540061393"
    //               : "https://play.google.com/store/apps/details?id=com.monsuivipsy",
    //         },
    //       ],
    //       { cancelable: true },
    //     ],
    //   });
    // }

    // if (body.event?.category === "IN_APP_CLICK" && body.event?.action === "COMMENT_CLICK") {
    //   return res.status(200).send({ ok: true });
    // }
    // if (body.event?.category === "OPEN_TAB" && body.event?.action === "CALENDAR_OPEN") {
    //   return res.status(200).send({
    //     ok: true,
    //     sendInApp: [
    //       "Bienvenue dans les analyses !",
    //       "Vous pourrez voir ici les mesures de vos saisies quotidiennes.",
    //       // [
    //       //   {
    //       //     text: "Pourquoi ?",
    //       //     navigate: ["HEALTH"],
    //       //   },
    //       //   {
    //       //     text: "Comment ?",
    //       //     navigate: ["CONSO_FOLLOW_UP"],
    //       //     style: "destructive",
    //       //     event: { category: "IN_APP_CLICK", action: "COMMENT_CLICK" },
    //       //   },
    //       // ],
    //       // { cancelable: true },
    //     ],
    //   });
    // }
    return res.status(200).send({ ok: true });
  })
);

module.exports = router;

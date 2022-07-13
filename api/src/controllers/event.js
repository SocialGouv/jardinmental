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

    // if (body.event?.category === "IN_APP_CLICK" && body.event?.action === "COMMENT_CLICK") {
    //   return res.status(200).send({ ok: true });
    // }
    console.log(body);
    if (body.event?.category === "APP" && body.event?.action === "APP_OPEN") {
      console.log("la");
      return res.status(200).send({
        ok: true,
        sendInApp: [
          "Bienvenue dans les analyses !",
          "Vous pourrez voir ici les mesures de vos saisies quotidiennes.",
          // [
          //   {
          //     text: "Pourquoi ?",
          //     navigate: ["HEALTH"],
          //   },
          //   {
          //     text: "Comment ?",
          //     navigate: ["CONSO_FOLLOW_UP"],
          //     style: "destructive",
          //     event: { category: "IN_APP_CLICK", action: "COMMENT_CLICK" },
          //   },
          // ],
          // { cancelable: true },
        ],
      });
    }
    return res.status(200).send({ ok: true });
  })
);

module.exports = router;

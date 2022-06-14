const { MINIMUM_MOBILE_APP_VERSION } = require("../config");

module.exports = ({ headers: { appversion, appdevice } }, res, next) => {
  if (!appversion) return res.status(403).send({ ok: false, message: "Veuillez mettre à jour votre application!" });
  const appVer = appversion.split(".").map((d) => parseInt(d));
  const minAppVer = MINIMUM_MOBILE_APP_VERSION.split(".").map((d) => parseInt(d));
  for (let i = 0; i < 3; i++) {
    if (appVer[i] < minAppVer[i]) {
      return res.status(403).send({
        ok: false,
        sendInApp: [
          "Votre application n'est pas à jour !",
          "Vous pouvez la mettre à jour en cliquant sur le lien ci-dessous",
          [
            {
              text: "Mettre à jour",
              link:
                appdevice === "android"
                  ? "https://play.google.com/store/apps/details?id=com.monsuivipsy"
                  : "https://apps.apple.com/fr/app/mon-suivi-psy/id1540061393",
            },
          ],
          { cancelable: true },
        ],
      });
    }
  }

  next();
};

const { MINIMUM_MOBILE_APP_VERSION } = require("../config");

module.exports = ({ headers: { appversion } }, res, next) => {
  if (!appversion) return res.status(403).send({ ok: false, message: "Veuillez mettre à jour votre application!" });
  const appVer = appversion.split(".").map((d) => parseInt(d));
  for (let i = 0; i < 3; i++) {
    if (appVer[i] > MINIMUM_MOBILE_APP_VERSION[i]) {
      return next();
    } else if (appVer[i] < MINIMUM_MOBILE_APP_VERSION[i]) {
      return res.status(403).send({
        ok: false,
        sendInApp: [
          "Votre application n'est pas à jour !",
          "Vous pouvez la mettre à jour en cliquant sur le lien ci-dessous",
          [{ text: "Mettre à jour", link: "https://www.ozensemble.fr" }],
          { cancelable: true },
        ],
      });
    }
  }

  next();
};

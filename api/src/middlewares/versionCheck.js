const { MINIMUM_MOBILE_BUILD_NUMBER } = require("../config");

module.exports = ({ headers: { appversion } }, res, next) => {
  if (!appversion) return res.status(403).send({ ok: false, sendInApp: ["Veuillez mettre à jour votre application!"] });
  if (Number(appversion) < MINIMUM_MOBILE_BUILD_NUMBER)
    return res.status(403).send({
      ok: false,
      sendInApp: [
        "Votre application n'est pas à jour !",
        "Vous pouvez la mettre à jour en cliquant sur le lien ci-dessous",
        [{ text: "Mettre à jour", link: "" }],
        { cancelable: true },
      ],
    });
  return next();
};

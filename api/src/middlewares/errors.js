const { capture } = require("../third-parties/sentry");

/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/
const catchErrors = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
const notFound = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host") + req.originalUrl;
  const err = new Error("Url not Found :", url);
  err.status = 404;
  next(err);
};

/*
  Development Error Handler

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
const sendError = (err, req, res, next) => {
  const { body, query, user, params, route, method, originalUrl, headers } = req;
  const { appversion, appdevice } = headers;
  capture(err, { extra: { body, query, params, route, method, originalUrl, appversion, appdevice }, user });

  return res
    .status(err.status || 500)
    .send({ ok: false, code: "SERVER_ERROR", error: "Désolé, une erreur est survenue, l'équipe technique est prévenue." });
};

module.exports = { catchErrors, notFound, sendError };

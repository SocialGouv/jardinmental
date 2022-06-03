const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const { VERSION, ENVIRONMENT, SENTRY_KEY } = require("../config");

const sentryEnabled = ENVIRONMENT !== "development" && ENVIRONMENT !== "test";

if (sentryEnabled) {
  Sentry.init({
    dsn: SENTRY_KEY,
    environment: `api-${ENVIRONMENT}`,
    release: VERSION,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

function capture(err, context = {}) {
  if (!sentryEnabled) {
    console.log("capture", err, JSON.stringify(context));
    return;
  }

  if (typeof context === "string") {
    context = JSON.parse(context);
  } else {
    context = JSON.parse(JSON.stringify(context));
  }
  if (!!context.extra && typeof context.extra !== "string") {
    try {
      const newExtra = {};
      for (const [extraKey, extraValue] of Object.entries(context.extra)) {
        if (typeof extraValue === "string") {
          newExtra[extraKey] = extraValue;
        } else {
          if (extraValue?.password) {
            extraValue.password = "******";
          }
          newExtra[extraKey] = JSON.stringify(extraValue);
        }
      }
      context.extra = newExtra;
    } catch (e) {
      Sentry.captureMessage(e, context);
    }
  }

  if (typeof err === "string") {
    Sentry.captureMessage(err, context);
  } else {
    Sentry.captureException(err, context);
  }
}

module.exports = { capture };

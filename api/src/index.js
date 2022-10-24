require("dotenv").config({ path: "./.env" });

const Sentry = require("@sentry/node");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");

const { PORT, VERSION, MOBILE_VERSION, MOBILE_ANDROID_BUILD_NUMBER, MOBILE_IOS_BUILD_NUMBER } = require("./config");
const errors = require("./middlewares/errors");
const versionCheck = require("./middlewares/versionCheck");

// Put together a schema
const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(Sentry.Handlers.requestHandler());

app.use(cors());

// kube probe
app.get("/healthz", async (req, res) => {
  res.send(`Hello World`);
});

app.get("/config", async (req, res) => {
  res.send({ VERSION, MOBILE_VERSION, MOBILE_ANDROID_BUILD_NUMBER, MOBILE_IOS_BUILD_NUMBER });
});

// hello world
const now = new Date();
app.get("/", async (req, res) => {
  res.send(`api MSP • ${now.toISOString()}`);
});

// Add header with API version to compare with client.
app.use((_req, res, next) => {
  res.header("X-API-VERSION", VERSION);
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
  res.header("Access-Control-Expose-Headers", "X-API-VERSION");
  next();
});

app.set("json replacer", (k, v) => (v === null ? undefined : v));
app.use(versionCheck);
app.get("/version", async (req, res) => {
  const appdevice = req.headers.appdevice;
  const mobileBuildNumber = appdevice === "ios" ? MOBILE_IOS_BUILD_NUMBER : MOBILE_ANDROID_BUILD_NUMBER;
  res.status(200).send({ ok: true, data: { MOBILE_VERSION, MOBILE_BUILD_NUMBER: mobileBuildNumber } });
});

// Pre middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(helmet());

// Routes

app.use("/event", require("./controllers/event"));
app.use("/reminder", require("./controllers/reminder").router);
app.use("/mail", require("./controllers/mail").router);

app.use(errors.sendError);

require("./cronjobs");

// Start the server
app.listen(PORT, () => console.log(`RUN ON PORT ${PORT}`));

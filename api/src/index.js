require("dotenv").config({ path: "./.env" });

const Sentry = require("@sentry/node");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("morgan");

const { PORT, VERSION } = require("./config");
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

// hello world
const now = new Date();
app.get("/", async (req, res) => {
  res.send(`Hello World at ${now.toISOString()}`);
});

// Add header with API version to compare with client.
app.use((_req, res, next) => {
  res.header("X-API-VERSION", VERSION);
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
  res.header("Access-Control-Expose-Headers", "X-API-VERSION");
  next();
});

//
app.set("json replacer", (k, v) => (v === null ? undefined : v));
app.use(versionCheck);
// Pre middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(helmet());

// Routes

app.use("/event", require("./controllers/event"));

app.use(errors.sendError);

// Start the server
app.listen(PORT, () => console.log(`RUN ON PORT ${PORT}`));

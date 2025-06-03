import 'dotenv/config';

// Initialize Sentry FIRST, before any other imports
import './third-parties/sentry';
import * as Sentry from '@sentry/node';

import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { PORT, VERSION, MOBILE_VERSION, MOBILE_ANDROID_BUILD_NUMBER, MOBILE_IOS_BUILD_NUMBER, DEBUG_ENDPOINTS_ENABLED, SENTRY_KEY } from './config';
import { ApiResponse } from './types/api.types';

// Import des middlewares et contrôleurs (encore en JS)
const errors = require('./middlewares/errors');
const versionCheck = require('./middlewares/versionCheck');

// Put together a schema
const app: Application = express();

// Sentry is automatically instrumented via the expressIntegration in the init

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());

// kube probe
app.get('/healthz', async (req: Request, res: Response) => {
  res.send('Hello World');
});

app.get('/config', async (req: Request, res: Response) => {
  res.send({ VERSION, MOBILE_VERSION, MOBILE_ANDROID_BUILD_NUMBER, MOBILE_IOS_BUILD_NUMBER });
});

// hello world
const now = new Date();
app.get('/', async (req: Request, res: Response) => {
  res.send({
    name: 'api jardin mental',
    last_deployed_at: now.toISOString(),
  });
});

// Add header with API version to compare with client.
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('X-API-VERSION', VERSION);
  // See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
  res.header('Access-Control-Expose-Headers', 'X-API-VERSION');
  next();
});

app.set('json replacer', (k: string, v: any) => (v === null ? undefined : v));
app.use(versionCheck);

app.get('/version', async (req: Request, res: Response) => {
  const appdevice = req.headers.appdevice as 'ios' | 'android' | undefined;
  const mobileBuildNumber = appdevice === 'ios' ? MOBILE_IOS_BUILD_NUMBER : MOBILE_ANDROID_BUILD_NUMBER;
  
  const response: ApiResponse<{ MOBILE_VERSION: string; MOBILE_BUILD_NUMBER: number }> = {
    ok: true,
    data: { MOBILE_VERSION, MOBILE_BUILD_NUMBER: mobileBuildNumber }
  };
  
  res.status(200).send(response);
});

// Pre middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(helmet());

// Routes
app.use('/event', require('./controllers/event'));
app.use('/reminder', require('./controllers/reminder').router);
app.use('/mail', require('./controllers/mail').router);

// Debug routes (only available when feature flag is enabled)
if (DEBUG_ENDPOINTS_ENABLED) {
  app.use('/debug', require('./controllers/debug').router);
}

// Sentry error handler must be before other error handlers
app.use(Sentry.Handlers.errorHandler());

app.use(errors.sendError);

// Start the server
app.listen(PORT, () => {
  console.log(`RUN ON PORT ${PORT}`)
  console.log(`ENVIRONMENT: ${process.env.ENVIRONMENT}`);
  console.log(`DEBUG ENABLE: ${DEBUG_ENDPOINTS_ENABLED}`);
  console.log(`SENTRY: ${SENTRY_KEY}`);
});

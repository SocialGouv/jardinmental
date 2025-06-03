import { Request, Response, NextFunction } from 'express';
import { Router } from 'express';
import { capture } from '../third-parties/sentry';
import { DEBUG_ENDPOINTS_ENABLED } from '../config';
import { ApiResponse } from '../types/api.types';

const router = Router();

/**
 * Middleware to check if debug endpoints are enabled
 */
const checkDebugEnabled = (req: Request, res: Response, next: NextFunction): void => {
  if (!DEBUG_ENDPOINTS_ENABLED) {
    res.status(404).json({
      ok: false,
      data: { error: 'Not found' }
    });
    return;
  }
  next();
};

/**
 * Simple endpoint to test Sentry error reporting
 * GET /debug/test-sentry
 */
router.get('/test-sentry', checkDebugEnabled, async (req: Request, res: Response): Promise<void> => {
  try {
    // Create a test error
    const testError = new Error('Sentry test error - this is intentional for testing purposes');
    
    // Capture the error with Sentry
    capture(testError, {
      tags: {
        type: 'debug',
        endpoint: 'test-sentry',
      },
      extra: {
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'],
        ip: req.ip,
      },
    });

    // Return success response
    const response: ApiResponse<{ message: string; timestamp: string }> = {
      ok: true,
      data: {
        message: 'Test error sent to Sentry successfully',
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    // If something goes wrong with the test itself
    const response: ApiResponse<{ error: string }> = {
      ok: false,
      data: {
        error: 'Failed to send test error to Sentry',
      },
    };

    res.status(500).json(response);
  }
});

export { router };

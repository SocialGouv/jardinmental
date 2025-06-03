import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { VERSION, ENVIRONMENT, SENTRY_KEY } from '../config';

const sentryEnabled = ENVIRONMENT !== 'development' && ENVIRONMENT !== 'test';

// Initialize Sentry
if (sentryEnabled && SENTRY_KEY) {
  console.log('Sentry init')
  Sentry.init({
    dsn: SENTRY_KEY,
    environment: `api-${ENVIRONMENT}`,
    release: VERSION,
    
    // Performance Monitoring
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0, // Capture 10% of transactions in production, 100% in other environments
    
    // Profiling
    profilesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0, // Set profiling sampling rate
    
    integrations: [
      // Add profiling integration
      nodeProfilingIntegration(),
      
      // HTTP integration for automatic instrumentation
      Sentry.httpIntegration(),
    ],
    
    // Configure what gets sent to Sentry
    beforeSend(event, hint) {
      // Filter out certain errors or modify events before sending
      const error = hint.originalException;
      
      // Don't send certain types of errors
      if (error && typeof error === 'object' && 'code' in error) {
        // Skip common network errors
        if (['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED'].includes(error.code as string)) {
          return null;
        }
      }
      
      // Sanitize sensitive data
      if (event.request?.data) {
        // Remove password fields
        if (typeof event.request.data === 'object') {
          const sanitized = { ...event.request.data };
          if ('password' in sanitized) {
            sanitized.password = '[Filtered]';
          }
          if ('token' in sanitized) {
            sanitized.token = '[Filtered]';
          }
          event.request.data = sanitized;
        }
      }
      
      return event;
    },
    
    // Configure which breadcrumbs to capture
    beforeBreadcrumb(breadcrumb) {
      // Filter out noisy breadcrumbs
      if (breadcrumb.category === 'http' && breadcrumb.data?.url?.includes('/healthz')) {
        return null;
      }
      return breadcrumb;
    },
  });
}

/**
 * Capture an exception or message to Sentry with additional context
 */
export function capture(error: Error | string, context: Record<string, any> = {}): void {
  if (!sentryEnabled) {
    console.log('Sentry capture (disabled):', error, JSON.stringify(context));
    return;
  }

  console.log('Sentry capture:', error, JSON.stringify(context));

  // Set user context if provided
  if (context.user) {
    Sentry.setUser(context.user);
  }

  // Set additional context
  if (context.extra) {
    Sentry.setContext('extra', context.extra);
  }

  // Set tags if provided
  if (context.tags) {
    Sentry.setTags(context.tags);
  }

  // Capture the error or message
  if (typeof error === 'string') {
    Sentry.captureMessage(error, 'error');
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Add a breadcrumb to the current scope
 */
export function addBreadcrumb(message: string, category: string = 'custom', level: Sentry.SeverityLevel = 'info', data?: Record<string, any>): void {
  if (!sentryEnabled) return;

  const breadcrumb: Sentry.Breadcrumb = {
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  };
  
  if (data) {
    breadcrumb.data = data;
  }
  
  Sentry.addBreadcrumb(breadcrumb);
}

/**
 * Set user context for the current scope
 */
export function setUser(user: { id?: string; email?: string; username?: string; [key: string]: any }): void {
  if (!sentryEnabled) return;
  Sentry.setUser(user);
}

/**
 * Set additional context for the current scope
 */
export function setContext(key: string, context: Record<string, any>): void {
  if (!sentryEnabled) return;
  Sentry.setContext(key, context);
}

/**
 * Set tags for the current scope
 */
export function setTags(tags: Record<string, string>): void {
  if (!sentryEnabled) return;
  Sentry.setTags(tags);
}

/**
 * Start a new span for performance monitoring
 */
export function startSpan<T>(name: string, op: string = 'custom', callback: () => T): T {
  if (!sentryEnabled) return callback();
  return Sentry.startSpan({ name, op }, callback);
}

export { Sentry };
export default Sentry;

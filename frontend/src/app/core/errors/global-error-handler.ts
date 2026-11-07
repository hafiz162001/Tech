import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { DatadogLoggerService } from '../services/datadog-logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger?: DatadogLoggerService;

  constructor(private injector: Injector) {}

  handleError(error: unknown): void {
    // Lazy get DatadogLoggerService to avoid circular dependency in early bootstrap
    if (!this.logger) {
      try {
        this.logger = this.injector.get(DatadogLoggerService);
      } catch {
        // Fallback if injector fails
      }
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    const stackTrace = error instanceof Error ? error.stack : undefined;

    if (this.logger) {
      this.logger.error('Unhandled Client Exception', error, {
        url: window.location.href,
        userAgent: navigator.userAgent,
        stack: stackTrace
      });
    }

    // Retain browser console logging for developer experience
    console.error('[GlobalErrorHandler]', error);
  }
}

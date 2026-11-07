import { Injectable } from '@angular/core';
import { datadogLogs } from '@datadog/browser-logs';
import { environment } from '../../../environments/environment';

export interface DatadogUserContext {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class DatadogLoggerService {
  private initialized = false;

  constructor() {
    this.init();
  }

  public init(): void {
    if (this.initialized) {
      return;
    }

    try {
      const config = environment.datadog;
      datadogLogs.init({
        clientToken: config.clientToken,
        site: config.site,
        service: config.service,
        env: config.env,
        version: config.version,
        forwardErrorsToLogs: config.forwardErrorsToLogs,
        forwardConsoleLogs: config.forwardConsoleLogs,
        sessionSampleRate: config.sessionSampleRate,
        telemetrySampleRate: config.telemetrySampleRate,
      });

      this.initialized = true;
      datadogLogs.logger.info('Datadog logger initialized successfully', {
        env: config.env,
        service: config.service
      });
    } catch (err) {
      console.warn('Failed to initialize Datadog Logs SDK:', err);
    }
  }

  public setUser(user: DatadogUserContext): void {
    if (!this.initialized) return;
    datadogLogs.setUser(user);
  }

  public clearUser(): void {
    if (!this.initialized) return;
    datadogLogs.clearUser();
  }

  public setContextProperty(key: string, value: unknown): void {
    if (!this.initialized) return;
    datadogLogs.setGlobalContextProperty(key, value);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    if (this.initialized) {
      datadogLogs.logger.info(message, context);
    }
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    if (this.initialized) {
      datadogLogs.logger.warn(message, context);
    }
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    if (this.initialized) {
      datadogLogs.logger.debug(message, context);
    }
  }

  public error(message: string, error?: unknown, context?: Record<string, unknown>): void {
    if (this.initialized) {
      const errorContext: Record<string, unknown> = {
        ...context,
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      };
      datadogLogs.logger.error(message, errorContext);
    }
  }
}

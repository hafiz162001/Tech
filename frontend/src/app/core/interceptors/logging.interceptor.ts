import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { DatadogLoggerService } from '../services/datadog-logger.service';

export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const datadog = inject(DatadogLoggerService);
  const startTime = Date.now();

  // Generate or forward request ID for distributed tracing with Spring Boot backend
  const requestId = req.headers.get('X-Request-ID') ||
    'fe-' + Math.random().toString(36).substring(2, 12);

  const clonedReq = req.clone({
    headers: req.headers.set('X-Request-ID', requestId)
  });

  return next(clonedReq).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const duration = Date.now() - startTime;
          // Log slow API calls (> 1500ms)
          if (duration > 1500) {
            datadog.warn('Slow API Response', {
              url: req.url,
              method: req.method,
              status: event.status,
              durationMs: duration,
              requestId
            });
          }
        }
      },
      error: (error: unknown) => {
        const duration = Date.now() - startTime;
        if (error instanceof HttpErrorResponse) {
          datadog.error('HTTP Request Failed', error, {
            url: req.url,
            method: req.method,
            status: error.status,
            statusText: error.statusText,
            durationMs: duration,
            requestId
          });
        }
      }
    })
  );
};

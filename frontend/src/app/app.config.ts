import { ApplicationConfig, provideZoneChangeDetection, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { talentReducer } from './store/talent/talent.reducer';
import { GlobalErrorHandler } from './core/errors/global-error-handler';
import { loggingInterceptor } from './core/interceptors/logging.interceptor';
import { DatadogLoggerService } from './core/services/datadog-logger.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideStore({
      talent: talentReducer
    }),
    provideAnimationsAsync(),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (datadog: DatadogLoggerService) => () => datadog.init(),
      deps: [DatadogLoggerService],
      multi: true
    }
  ]
};

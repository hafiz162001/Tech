export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api/v1',
  datadog: {
    clientToken: 'pub_mock_datadog_client_token_dev',
    site: 'datadoghq.com',
    service: 'eterna-frontend',
    env: 'development',
    version: '1.0.0',
    sessionSampleRate: 100,
    telemetrySampleRate: 100,
    forwardErrorsToLogs: true,
    forwardConsoleLogs: ['error', 'warn'] as ('error' | 'warn')[],
  }
};

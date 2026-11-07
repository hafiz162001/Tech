export const environment = {
  production: true,
  apiBaseUrl: 'https://api.eterna.io/api/v1',
  datadog: {
    clientToken: 'pub_mock_datadog_client_token_prod',
    site: 'datadoghq.com',
    service: 'eterna-frontend',
    env: 'production',
    version: '1.0.0',
    sessionSampleRate: 100,
    telemetrySampleRate: 100,
    forwardErrorsToLogs: true,
    forwardConsoleLogs: ['error'] as ('error')[],
  }
};

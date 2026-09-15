import { http, HttpResponse, delay, passthrough } from 'msw';
import { authHandlers } from './handlers/auth';
import { dashboardHandlers } from './handlers/dashboard';
import { billingHandlers } from './handlers/billing';
import { teamHandlers } from './handlers/team';
import { notificationHandlers } from './handlers/notifications';

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...billingHandlers,
  ...teamHandlers,
  ...notificationHandlers,
  // Catch-all for unhandled GETs returns empty 204
  http.all('*', () => passthrough()),
];

// Helper to simulate network failure
export const networkFailure = http.get('*', async () => {
  await delay(100);
  return HttpResponse.error();
});

export const slowNetwork = (ms: number) =>
  http.get('*', async () => {
    await delay(ms);
    return HttpResponse.json({});
  });

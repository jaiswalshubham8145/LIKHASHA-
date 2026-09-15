import { chromium, type FullProject } from '@playwright/test';

export default async function globalSetup() {
  // Ensure a clean DB state for the e2e suite
  if (process.env.E2E_RESET_DB !== '0') {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.request.post(`${process.env.E2E_API_URL ?? 'http://localhost:3100'}/__test__/reset`, {
      headers: { 'x-test-token': process.env.E2E_TEST_TOKEN ?? 'test' },
      failOnStatusCode: false,
    });
    await browser.close();
  }
}

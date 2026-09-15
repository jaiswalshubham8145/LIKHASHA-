import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';
import { authenticateAs, type Role } from './fixtures/auth';
import AxeBuilder from '@axe-core/playwright';

export type TestFixtures = {
  page: Page;
  ownerPage: Page;
  memberPage: Page;
  anonymousPage: Page;
  makeAxe: () => AxeBuilder;
};

export const test = base.extend<TestFixtures>({
  page: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
  ownerPage: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await authenticateAs(page, 'owner');
    await use(page);
    await ctx.close();
  },
  memberPage: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await authenticateAs(page, 'member');
    await use(page);
    await ctx.close();
  },
  anonymousPage: async ({ browser }, use) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
  makeAxe: async ({ page }, use) => {
    const builder = () => new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']);
    await use(builder);
  },
});

export { expect };

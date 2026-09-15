import { test, expect } from '../e2e/fixtures/test';

const journeys: Array<{ name: string; start: () => Promise<void> }> = [
  {
    name: 'login-then-dashboard',
    start: async () => {},
  },
];

for (const { name } of journeys) {
  test(`keyboard-only: ${name}`, async ({ ownerPage }) => {
    await ownerPage.goto('/dashboard');

    // Skip link should be first focusable element
    await ownerPage.keyboard.press('Tab');
    const first = ownerPage.locator(':focus');
    await expect(first).toHaveAttribute('href', '#main');

    // Tab through main nav — every focusable should have a visible focus ring
    const focused: string[] = [];
    for (let i = 0; i < 20; i++) {
      await ownerPage.keyboard.press('Tab');
      const tag = await ownerPage.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        const ring = getComputedStyle(el).outlineStyle;
        if (ring === 'none') return `${el.tagName}:no-ring`;
        return el.tagName;
      });
      if (!tag) break;
      focused.push(tag);
    }
    expect(focused.find((f) => f.endsWith(':no-ring'))).toBeUndefined();
  });
}

test('skip-link moves focus to main', async ({ ownerPage }) => {
  await ownerPage.goto('/dashboard');
  await ownerPage.keyboard.press('Tab');
  await ownerPage.keyboard.press('Enter');
  const main = ownerPage.locator('#main');
  await expect(main).toBeFocused();
});

test('modal traps focus and restores on close', async ({ ownerPage }) => {
  await ownerPage.goto('/settings/team');
  await ownerPage.getByRole('button', { name: /invite member/i }).click();
  const dialog = ownerPage.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // Tab through, ensure focus stays inside dialog
  for (let i = 0; i < 6; i++) {
    await ownerPage.keyboard.press('Tab');
    const inside = await ownerPage.evaluate(() => {
      const el = document.activeElement;
      return el ? document.querySelector('[role="dialog"]')!.contains(el) : false;
    });
    expect(inside, `focus escaped dialog at iteration ${i}`).toBe(true);
  }
  await ownerPage.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  // Focus restored to the trigger
  await expect(ownerPage.getByRole('button', { name: /invite member/i })).toBeFocused();
});

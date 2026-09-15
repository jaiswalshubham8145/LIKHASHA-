import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { renderWithProviders, checkA11y } from '@tests/setup/test-utils';

describe('<Button />', () => {
  it('renders children', () => {
    renderWithProviders(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('applies variant and size classes', () => {
    renderWithProviders(<Button variant="destructive" size="lg">Delete</Button>);
    const btn = screen.getByRole('button');
    expect(btn.className).toMatch(/destructive|lg|btn/);
  });

  it('handles click events', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire click when disabled', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(
      <Button disabled onClick={onClick}>Disabled</Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire click when loading', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(
      <Button loading onClick={onClick}>Saving…</Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes loading state to assistive tech', () => {
    renderWithProviders(<Button loading>Submit</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveAttribute('aria-busy', 'true');
  });

  it('supports asChild with Slot', () => {
    renderWithProviders(
      <Button asChild>
        <a href="/foo">Go</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link).toBeInTheDocument();
  });

  it('forwards ref', () => {
    let captured: HTMLButtonElement | null = null;
    renderWithProviders(
      <Button ref={(el) => { captured = el; }}>Ref</Button>,
    );
    expect(captured).toBeInstanceOf(HTMLButtonElement);
  });

  it('triggers via keyboard (Enter and Space)', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(<Button onClick={onClick}>Press</Button>);
    const btn = screen.getByRole('button');
    btn.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('renders as a link when href is provided', () => {
    renderWithProviders(<Button href="/dashboard">Open</Button>);
    expect(screen.getByRole('link', { name: 'Open' })).toHaveAttribute('href', '/dashboard');
  });

  it('has no a11y violations in any variant', async () => {
    const variants: Array<['primary' | 'secondary' | 'destructive' | 'ghost', 'sm' | 'md' | 'lg']> = [
      ['primary', 'sm'], ['primary', 'md'], ['primary', 'lg'],
      ['secondary', 'md'], ['destructive', 'md'], ['ghost', 'md'],
    ];
    for (const [variant, size] of variants) {
      const { container, unmount } = renderWithProviders(
        <Button variant={variant} size={size}>Hello</Button>,
      );
      await checkA11y(container);
      unmount();
    }
  });

  it('icon-only button has accessible name', async () => {
    const { container } = renderWithProviders(
      <Button aria-label="Close" size="icon"><span aria-hidden>×</span></Button>,
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    await checkA11y(container);
  });
});

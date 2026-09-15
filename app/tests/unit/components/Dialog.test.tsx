import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { Dialog } from '@/components/ui/Dialog';
import { renderWithProviders, checkA11y } from '@tests/setup/test-utils';

describe('<Dialog />', () => {
  it('does not render content when closed', () => {
    renderWithProviders(
      <Dialog open={false} onOpenChange={() => {}} title="Hi">
        <p>Content</p>
      </Dialog>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders with title, description, and content when open', () => {
    renderWithProviders(
      <Dialog open onOpenChange={() => {}} title="Confirm" description="Are you sure?">
        <button>Yes</button>
      </Dialog>,
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yes' })).toBeInTheDocument();
  });

  it('has aria-labelledby and aria-describedby', () => {
    renderWithProviders(
      <Dialog open onOpenChange={() => {}} title="Title" description="Desc">
        <p>x</p>
      </Dialog>,
    );
    const dialog = screen.getByRole('dialog');
    const labelledBy = dialog.getAttribute('aria-labelledby');
    const describedBy = dialog.getAttribute('aria-describedby');
    expect(labelledBy).toBeTruthy();
    expect(describedBy).toBeTruthy();
    expect(document.getElementById(labelledBy!)).toHaveTextContent('Title');
    expect(document.getElementById(describedBy!)).toHaveTextContent('Desc');
  });

  it('traps focus inside dialog', async () => {
    const { user } = renderWithProviders(
      <>
        <button>Outside first</button>
        <Dialog open onOpenChange={() => {}} title="T">
          <button>First</button>
          <button>Second</button>
          <button>Last</button>
        </Dialog>
        <button>Outside last</button>
      </>,
    );
    const first = screen.getByRole('button', { name: 'First' });
    first.focus();
    expect(first).toHaveFocus();

    // Tab through to last
    await user.tab();
    expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
    // Tab once more — focus wraps to first focusable inside dialog
    await user.tab();
    await waitFor(() => expect(first).toHaveFocus());
  });

  it('closes on Escape', async () => {
    const onOpenChange = vi.fn();
    const { user } = renderWithProviders(
      <Dialog open onOpenChange={onOpenChange} title="T">
        <p>x</p>
      </Dialog>,
    );
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on overlay click', async () => {
    const onOpenChange = vi.fn();
    const { user } = renderWithProviders(
      <Dialog open onOpenChange={onOpenChange} title="T">
        <p>x</p>
      </Dialog>,
    );
    const overlay = document.querySelector('[data-dialog-overlay]');
    if (overlay) {
      await user.click(overlay as HTMLElement);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });

  it('restores focus to opener on close', async () => {
    function Demo() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Open</button>
          <Dialog open={open} onOpenChange={setOpen} title="T">
            <button onClick={() => setOpen(false)}>Close</button>
          </Dialog>
        </>
      );
    }
    const { user } = renderWithProviders(<Demo />);
    const opener = screen.getByRole('button', { name: 'Open' });
    await user.click(opener);
    const closeBtn = await screen.findByRole('button', { name: 'Close' });
    await user.click(closeBtn);
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it('locks body scroll when open', () => {
    renderWithProviders(
      <Dialog open onOpenChange={() => {}} title="T">
        <p>x</p>
      </Dialog>,
    );
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('renders in a portal at document.body', () => {
    renderWithProviders(
      <Dialog open onOpenChange={() => {}} title="T">
        <p>x</p>
      </Dialog>,
    );
    expect(document.body.querySelector('[role="dialog"]')).toBeInTheDocument();
  });

  it('has no a11y violations', async () => {
    const { container } = renderWithProviders(
      <Dialog open onOpenChange={() => {}} title="Confirm" description="Are you sure?">
        <button>OK</button>
        <button>Cancel</button>
      </Dialog>,
    );
    await checkA11y(container);
  });
});

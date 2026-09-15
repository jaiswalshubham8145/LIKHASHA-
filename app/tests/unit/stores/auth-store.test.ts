import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useAuthStore } from '@/stores/auth-store';

const initialState = () => {
  useAuthStore.setState({
    session: null,
    status: 'idle',
    error: null,
  });
};

describe('auth store', () => {
  beforeEach(initialState);

  it('starts in idle state with no session', () => {
    const { session, status, error } = useAuthStore.getState();
    expect(session).toBeNull();
    expect(status).toBe('idle');
    expect(error).toBeNull();
  });

  it('signIn sets loading then session on success', async () => {
    const { signIn } = useAuthStore.getState();
    const promise = act(async () => {
      await signIn({ email: 'user@example.com', password: 'good-pass-1234' });
    });
    // After the act, state should be updated
    const { session, status } = useAuthStore.getState();
    expect(status).toBe('authenticated');
    expect(session?.user.email).toBe('user@example.com');
    expect(session?.accessToken).toBeTruthy();
    await promise;
  });

  it('signIn sets error on failure', async () => {
    const { signIn } = useAuthStore.getState();
    await act(async () => {
      try {
        await signIn({ email: 'user@example.com', password: 'wrong' });
      } catch {
        // expected
      }
    });
    const { status, error, session } = useAuthStore.getState();
    expect(status).toBe('error');
    expect(error).toBeTruthy();
    expect(session).toBeNull();
  });

  it('signOut clears state', async () => {
    const { signIn, signOut } = useAuthStore.getState();
    await act(async () => {
      await signIn({ email: 'a@b.com', password: 'good-pass-1234' });
    });
    expect(useAuthStore.getState().session).not.toBeNull();
    await act(async () => {
      await signOut();
    });
    const { session, status } = useAuthStore.getState();
    expect(session).toBeNull();
    expect(status).toBe('idle');
  });

  it('clearError resets error to null', () => {
    useAuthStore.setState({ error: 'boom' });
    act(() => useAuthStore.getState().clearError());
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('isAuthenticated selector reflects state', async () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
    await act(async () => {
      await useAuthStore.getState().signIn({ email: 'a@b.com', password: 'good-pass-1234' });
    });
    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
  });
});

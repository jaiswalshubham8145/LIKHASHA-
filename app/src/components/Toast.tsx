'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type ToastKind = 'info' | 'success' | 'warning' | 'danger';
export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  durationMs?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  push: (t: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function makeId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = makeId();
      const toast: Toast = { durationMs: 4000, ...t, id };
      setToasts((prev) => [...prev, toast]);
      if (toast.durationMs && toast.durationMs > 0) {
        setTimeout(() => dismiss(id), toast.durationMs);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toasts, push, dismiss }), [toasts, push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

function ToastViewport() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 p-4 sm:items-end sm:bottom-4 sm:right-4"
    >
      {ctx.toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          data-testid="toast"
          className={cn(
            'pointer-events-auto w-full max-w-sm rounded-md border bg-bg px-4 py-3 shadow-lg',
            t.kind === 'success' && 'border-success/40',
            t.kind === 'warning' && 'border-warning/40',
            t.kind === 'danger' && 'border-danger/40',
            t.kind === 'info' && 'border-info/40',
          )}
        >
          <div className="font-medium">{t.title}</div>
          {t.description && <div className="mt-1 text-sm text-muted">{t.description}</div>}
          <button
            type="button"
            onClick={() => ctx.dismiss(t.id)}
            className="absolute right-2 top-2 text-muted hover:text-fg"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

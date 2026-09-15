'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
  closeOnOverlayClick = true,
}: DialogProps) {
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      previouslyFocused.current = (document.activeElement as HTMLElement) ?? null;
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
        // Restore focus
        previouslyFocused.current?.focus?.();
      };
    }
    return;
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          data-dialog-overlay=""
          className={cn(
            'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm',
            'data-[state=open]:animate-fade-in',
          )}
          onClick={(e) => {
            if (!closeOnOverlayClick) return;
            // Click on overlay only — overlay fills the backdrop
            if (e.target === e.currentTarget) onOpenChange(false);
          }}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-md rounded-lg border border-border bg-bg p-6 shadow-xl',
            'data-[state=open]:animate-slide-up',
            'focus:outline-none',
            className,
          )}
          aria-describedby={description ? undefined : undefined}
        >
          <DialogPrimitive.Title className="text-lg font-semibold text-fg">
            {title}
          </DialogPrimitive.Title>
          {description && (
            <DialogPrimitive.Description className="mt-1 text-sm text-muted">
              {description}
            </DialogPrimitive.Description>
          )}
          <div className="mt-4">{children}</div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

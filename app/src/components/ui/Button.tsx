'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  asChild?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  href?: string;
}

const baseStyles =
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50 select-none';

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
  secondary: 'bg-bg text-fg border border-border hover:bg-muted/10',
  destructive: 'bg-danger text-white hover:bg-danger/90',
  ghost: 'text-fg hover:bg-muted/15',
  outline: 'border border-border bg-transparent text-fg hover:bg-muted/10',
  link: 'text-brand-600 underline-offset-4 hover:underline px-0',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
  icon: 'h-10 w-10 p-0',
};

function Spinner({ className }: { className?: string }) {
  return (
    <span role="status" aria-hidden="true" className={cn('inline-block h-4 w-4 animate-spin', className)}>
      <svg viewBox="0 0 24 24" className="h-full w-full">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    asChild = false,
    leftIcon,
    rightIcon,
    href,
    className,
    children,
    type,
    ...rest
  },
  ref,
) {
  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  // Render as anchor when href is provided
  if (href && !asChild) {
    return (
      <a
        href={href}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
      >
        {loading && <Spinner />}
        {leftIcon}
        <span>{children}</span>
        {rightIcon}
      </a>
    );
  }

  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      ref={ref as never}
      className={classes}
      type={asChild ? undefined : (type ?? 'button')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading || undefined}
      {...rest}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      )}
    </Comp>
  );
});

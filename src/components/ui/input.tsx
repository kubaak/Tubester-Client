import * as React from 'react';

import { cn } from '@/lib/cn';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', disabled, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(
        'flex h-11 w-full rounded-2xl border border-border/50 bg-card px-4 py-2 text-sm text-card-foreground transition-colors',
        'placeholder:text-muted-foreground/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

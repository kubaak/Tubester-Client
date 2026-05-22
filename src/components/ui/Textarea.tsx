import * as React from 'react';

import { cn } from '@/lib/cn';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, disabled, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      disabled={disabled}
      className={cn(
        'flex min-h-[96px] w-full rounded-2xl border border-border/50 bg-card px-4 py-3 text-sm leading-6 text-card-foreground transition-colors',
        'placeholder:text-muted-foreground/50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-60',
        'resize-vertical',
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

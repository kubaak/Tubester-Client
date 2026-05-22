import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background hover-lift active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          'glass bg-gradient-primary text-primary-foreground shadow-moderate hover:shadow-strong border border-primary/20 hover:border-primary/30',
        destructive:
          'glass bg-destructive text-destructive-foreground shadow-moderate hover:shadow-strong border border-destructive/20 hover:border-destructive/30',
        outline:
          'glass border border-border/50 bg-background/80 text-foreground shadow-soft hover:shadow-moderate hover:border-primary/30 hover:bg-accent/50',
        secondary:
          'glass bg-gradient-secondary text-secondary-foreground shadow-soft hover:shadow-moderate border border-border/30 hover:border-border/50',
        ghost: 'text-muted-foreground hover:bg-accent/30 hover:text-accent-foreground rounded-xl',
        link: 'text-primary underline-offset-4 hover:underline hover:text-primary/80 rounded-xl',
        success:
          'glass bg-success text-success-foreground shadow-moderate hover:shadow-strong border border-success/20 hover:border-success/30',
        warning:
          'glass bg-warning text-warning-foreground shadow-moderate hover:shadow-strong border border-warning/20 hover:border-warning/30',
        ai: 'bg-violet-600 text-white shadow-md shadow-violet-200 hover:bg-violet-700',
      },
      size: {
        default: 'h-11 px-6 py-3 text-sm has-[>svg]:px-4',
        sm: 'h-9 px-4 py-2 text-xs has-[>svg]:px-3 rounded-xl',
        lg: 'h-13 px-8 py-4 text-base has-[>svg]:px-6',
        xl: 'h-16 px-10 py-5 text-lg has-[>svg]:px-8',
        icon: 'size-11 p-0',
        'icon-sm': 'size-9 p-0 rounded-xl',
        'icon-lg': 'size-13 p-0',
        'icon-xl': 'size-16 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

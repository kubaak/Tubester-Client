import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import type { VideoListItemDto } from '@/api';
import { cn } from '@/lib/cn';

type Props = {
  label: string;
  selected?: VideoListItemDto;
  placeholder?: string;
  disabled?: boolean;
  open: boolean;
  onClick: () => void;
};

export const VideoSelectTrigger = forwardRef<HTMLButtonElement, Props>(function VideoSelectTrigger(
  { label, selected, placeholder = 'Select a video…', disabled, open, onClick },
  ref,
) {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-foreground mb-1">{label}</label>

      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        className={cn(
          'w-full rounded-xl border border-border/50 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/20 text-left flex items-center justify-between',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <span className="inline-flex min-w-0 items-center gap-3">
            {selected.thumbnailUrl && (
              <img
                src={selected.thumbnailUrl}
                alt={selected.title ?? 'Selected video thumbnail'}
                className="w-15 h-9 rounded object-cover border border-border/50"
                loading="lazy"
              />
            )}
            <span className="truncate" title={selected.title ?? selected.videoId ?? ''}>
              {selected.title ?? selected.videoId}
            </span>
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronDown aria-hidden="true" className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} />
      </button>
    </div>
  );
});

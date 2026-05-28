import { useId } from 'react';
import { Filter, RotateCcw, X } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { VideoSelect } from '../../videos/components/VideoSelect';
import type { RepliesFilters } from '../../../hooks/useRepliesSearch';

interface RepliesFilterSectionProps {
  draftFilters: RepliesFilters;
  onDraftFiltersChange: (filters: RepliesFilters) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
}

export function RepliesFilterSection({
  draftFilters,
  onDraftFiltersChange,
  onApply,
  onReset,
  onClose,
}: RepliesFilterSectionProps) {
  const searchInputId = useId();

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-soft animate-scale-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-card-foreground">Filters</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          aria-label="Close filters"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <VideoSelect
          label="Video"
          value={draftFilters.videoId}
          onChange={(videoId) => onDraftFiltersChange({ ...draftFilters, videoId })}
          placeholder="Filter by video..."
          showVisibilities={false}
        />

        <div className="space-y-2">
          <label htmlFor={searchInputId} className="text-xs font-medium text-muted-foreground">
            Search in comments
          </label>
          <input
            id={searchInputId}
            type="text"
            value={draftFilters.originalComment ?? ''}
            onChange={(e) => onDraftFiltersChange({ ...draftFilters, originalComment: e.target.value })}
            placeholder="Filter by original comment text..."
            className="w-full rounded-xl border border-border/50 bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={onApply}>
          Apply Filters
        </Button>
        <Button size="sm" variant="ghost" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      </div>
    </div>
  );
}

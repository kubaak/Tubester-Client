import { Check, X, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';

interface RepliesSelectionBarProps {
  selectedCount: number;
  allSelected: boolean;
  onToggleSelectAll: () => void;
  onClearSelection: () => void;
  onBatchIgnore: () => void;
  onBatchApprove: () => void;
  isActionPending: boolean;
}

export function RepliesSelectionBar({
  selectedCount,
  allSelected,
  onToggleSelectAll,
  onClearSelection,
  onBatchIgnore,
  onBatchApprove,
  isActionPending,
}: RepliesSelectionBarProps) {
  const hasSelection = selectedCount > 0;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Checkbox
          checked={allSelected}
          onChange={() => onToggleSelectAll()}
          disabled={isActionPending}
          label={allSelected ? 'Deselect all' : 'Select all'}
        />

        {hasSelection && (
          <Button type="button" variant="ghost" size="sm" onClick={onClearSelection} disabled={isActionPending}>
            <XCircle className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}

        <span className="text-xs text-muted-foreground">
          {hasSelection ? `${selectedCount} selected` : 'No replies selected'}
        </span>
      </div>

      {hasSelection && (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onBatchIgnore} disabled={isActionPending}>
            <X className="h-3.5 w-3.5" />
            Ignore selected
          </Button>

          <Button type="button" size="sm" onClick={onBatchApprove} disabled={isActionPending}>
            <Check className="h-3.5 w-3.5" />
            Approve selected
          </Button>
        </div>
      )}
    </div>
  );
}

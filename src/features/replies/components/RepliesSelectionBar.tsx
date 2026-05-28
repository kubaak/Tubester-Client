import { Check, X, XCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { useReplyApproveCreditCost } from '../hooks/useReplyApproveCreditCost';

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
  const creditCost = useReplyApproveCreditCost(selectedCount);

  const canBatchApprove = hasSelection && !isActionPending && creditCost.isReady && !creditCost.insufficientBalance;

  const batchApproveButtonLabel = (() => {
    if (creditCost.isLoading) {
      return 'Approve selected…';
    }

    if (creditCost.isError || !creditCost.isReady || creditCost.totalCost === null) {
      return 'Approve selected';
    }

    return `Approve selected · ${creditCost.totalCost} credits`;
  })();

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <Checkbox
          checked={allSelected}
          onChange={onToggleSelectAll}
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
        <div className="flex flex-col items-stretch gap-1 sm:items-end">
          {creditCost.insufficientBalance && creditCost.balance !== null && creditCost.totalCost !== null && (
            <p className="text-sm text-red-600">
              Insufficient balance. You need {creditCost.totalCost} credits, but you have {creditCost.balance}.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onBatchIgnore} disabled={isActionPending}>
              <X className="h-3.5 w-3.5" />
              Ignore selected
            </Button>

            <Button type="button" size="sm" onClick={onBatchApprove} disabled={!canBatchApprove}>
              <Check className="h-3.5 w-3.5" />
              {batchApproveButtonLabel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

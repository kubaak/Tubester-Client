import { useSubmitToYouTubeCreditCost } from '@/features/videos/hooks/useSubmitToYouTubeCreditCost';
import { Button } from '@/components/ui/button';

export type ActionsProps = {
  isDirty: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  disabled: boolean;
  onSaveDraft: () => void;
  onSubmitToYouTube: () => void;
};

export function Actions({ isDirty, isSaving, isSubmitting, disabled, onSaveDraft, onSubmitToYouTube }: ActionsProps) {
  const creditCost = useSubmitToYouTubeCreditCost();

  const canSubmit = !disabled && !isSaving && !isSubmitting && creditCost.isReady && !creditCost.insufficientBalance;

  const submitButtonLabel = (() => {
    if (isSubmitting) {
      return 'Submitting…';
    }

    if (creditCost.isLoading) {
      return 'Loading credit cost…';
    }

    if (creditCost.isError || !creditCost.isReady || creditCost.totalCost === null) {
      return 'Credit cost unavailable';
    }

    if (creditCost.insufficientBalance) {
      return 'Not enough credits';
    }

    return `Submit to YouTube · ${creditCost.totalCost} credits`;
  })();

  return (
    <div className="flex flex-col-reverse gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-end">
      <Button
        type="button"
        variant="outline"
        disabled={disabled || !isDirty || isSaving || isSubmitting}
        onClick={onSaveDraft}
      >
        {isSaving ? 'Saving...' : 'Save draft'}
      </Button>

      <div className="flex flex-col items-stretch gap-1 sm:items-end">
        {creditCost.insufficientBalance && creditCost.balance !== null && creditCost.totalCost !== null && (
          <p className="text-sm text-red-600">
            Insufficient balance. You need {creditCost.totalCost} credits, but you have {creditCost.balance}.
          </p>
        )}

        <Button type="button" onClick={onSubmitToYouTube} disabled={!canSubmit} className="w-full sm:min-w-[220px]">
          {submitButtonLabel}
        </Button>
      </div>
    </div>
  );
}

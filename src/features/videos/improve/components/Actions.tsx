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

      <Button type="button" disabled={disabled || isSaving || isSubmitting} onClick={onSubmitToYouTube}>
        {isSubmitting ? 'Submitting...' : 'Submit to YouTube'}
      </Button>
    </div>
  );
}

import { Sparkles, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ImproveWithAiCardProps = {
  isAiInProgress: boolean;
  onImproveClick: () => void;
};

export function ImproveWithAiCard({ isAiInProgress, onImproveClick }: ImproveWithAiCardProps) {
  return (
    <section
      aria-labelledby="improve-ai-card-title"
      className="overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-violet-600 p-2.5 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>

          <div>
            <div id="improve-ai-card-title" className="text-base font-semibold text-slate-950">
              Ready to improve this video?
            </div>

            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Generate better title, description, tags, or playlist suggestions with AI. You can review and edit
              everything before saving.
            </p>
          </div>
        </div>

        <Button type="button" onClick={onImproveClick} disabled={isAiInProgress} variant="ai" className="min-w-[160px]">
          {isAiInProgress ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Improve with AI
            </>
          )}
        </Button>
      </div>
    </section>
  );
}

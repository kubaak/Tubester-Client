import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/Textarea';
import { AiOptionCard } from '@/feautures/videos/improve/components/AiOptionCard';
import { useAiCreditCost, type AiOperationSelection } from '@/feautures/videos/hooks/useAiCreditCost';
import {
  useAiTemplateOperationMutation,
  type AiTemplateOperationMutationInput,
} from '@/feautures/videos/hooks/useAiTemplateOperationMutation';
import type { AiVideoTemplateRequest, VideoDetailsDto } from '@/api';

export type AiDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
  videoTitle?: string | null;
  videoDetails?: VideoDetailsDto;
  onSuccess: () => void | Promise<void>;
};

type FormValues = AiOperationSelection & {
  promptEnrichment: string;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Failed to generate suggestions.';
}

function hasAnySelectedOperation(selection: AiOperationSelection): boolean {
  return (
    selection.generateTitle === true ||
    selection.generateDescription === true ||
    selection.generateTags === true ||
    selection.suggestPlaylists === true
  );
}

export function AiDialog({ open, onOpenChange, videoId, videoTitle, videoDetails, onSuccess }: AiDialogProps) {
  const aiTemplateMutation = useAiTemplateOperationMutation();
  const isSubmittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, watch, reset } = useForm<FormValues>({
    defaultValues: {
      promptEnrichment: '',
      generateTitle: true,
      generateDescription: true,
      generateTags: true,
      suggestPlaylists: true,
    },
  });

  const promptEnrichment = watch('promptEnrichment');
  const generateTitle = watch('generateTitle');
  const generateDescription = watch('generateDescription');
  const generateTags = watch('generateTags');
  const suggestPlaylists = watch('suggestPlaylists');

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }

    reset({
      promptEnrichment: videoTitle ?? '',
      generateTitle: true,
      generateDescription: true,
      generateTags: true,
      suggestPlaylists: true,
    });
  }, [open, videoTitle, reset]);

  const isTitleInProgress = videoDetails?.isAiTitleInProgress === true;
  const isDescriptionInProgress = videoDetails?.isAiDescriptionInProgress === true;
  const isTagsInProgress = videoDetails?.isAiTagsInProgress === true;
  const isPlaylistSuggestionInProgress = videoDetails?.isAiPlaylistSuggestionInProgress === true;

  const canSelectTitle = !isTitleInProgress;
  const canSelectDescription = !isDescriptionInProgress;
  const canSelectTags = !isTagsInProgress;
  const canSelectPlaylists = !isPlaylistSuggestionInProgress;

  const effectiveSelection = useMemo<AiOperationSelection>(
    () => ({
      generateTitle: generateTitle && canSelectTitle,
      generateDescription: generateDescription && canSelectDescription,
      generateTags: generateTags && canSelectTags,
      suggestPlaylists: suggestPlaylists && canSelectPlaylists,
    }),
    [
      generateTitle,
      generateDescription,
      generateTags,
      suggestPlaylists,
      canSelectTitle,
      canSelectDescription,
      canSelectTags,
      canSelectPlaylists,
    ],
  );

  const creditCost = useAiCreditCost(effectiveSelection);

  const hasPromptEnrichment = promptEnrichment.trim().length > 0;
  const hasSelectedAvailableOperation = hasAnySelectedOperation(effectiveSelection);

  const canSubmit =
    videoId.length > 0 &&
    hasPromptEnrichment &&
    !isSubmitting &&
    hasSelectedAvailableOperation &&
    creditCost.isReady &&
    !creditCost.insufficientBalance;

  const submitButtonLabel = (() => {
    if (isSubmitting) {
      return 'Improving…';
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

    return `Improve with AI · ${creditCost.totalCost} credits`;
  })();

  const optionCards = [
    {
      label: 'Title',
      description: 'Make a stronger, more clickable title.',
      inProgress: isTitleInProgress,
      disabled: !canSelectTitle,
      registration: register('generateTitle'),
    },
    {
      label: 'Description',
      description: 'Make a clearer, more useful video description.',
      inProgress: isDescriptionInProgress,
      disabled: !canSelectDescription,
      registration: register('generateDescription'),
    },
    {
      label: 'Tags',
      description: 'Suggest tags that better match the content.',
      inProgress: isTagsInProgress,
      disabled: !canSelectTags,
      registration: register('generateTags'),
    },
    {
      label: 'Suggest playlists',
      description: 'Suggest playlists to add this video to.',
      inProgress: isPlaylistSuggestionInProgress,
      disabled: !canSelectPlaylists,
      registration: register('suggestPlaylists'),
    },
  ];

  const handleSubmit = async () => {
    if (isSubmittingRef.current || !canSubmit || creditCost.totalCost === null) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const request: AiVideoTemplateRequest = {
        targetVideoId: videoId,
        promptEnrichment: promptEnrichment.trim(),
        expectedCreditCost: creditCost.totalCost,
        ...effectiveSelection,
      };

      const input: AiTemplateOperationMutationInput = {
        data: request,
        operationId: crypto.randomUUID(),
      };

      await aiTemplateMutation.mutateAsync(input);
      onOpenChange(false);
      await onSuccess();
    } catch {
      // Error is displayed through aiTemplateMutation.error.
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Improve with AI</DialogTitle>
          <DialogDescription>
            Let AI generate title, description, tags, and playlist suggestions for this video. You can review and edit
            everything before applying.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label htmlFor="promptEnrichment" className="block text-sm font-medium text-slate-900">
              Tell the AI what this video is about
            </label>

            <p className="mt-1 text-sm text-slate-500">
              Optionally add context, audience, tone, keywords, or anything you want the AI to consider.
            </p>

            <Textarea
              id="promptEnrichment"
              {...register('promptEnrichment')}
              rows={4}
              className="mt-3"
              placeholder="e.g., Funny cat compilation"
              disabled={isSubmitting}
            />
          </div>

          <fieldset disabled={isSubmitting} className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3">
                <div className="text-sm font-semibold text-slate-900">What should the AI improve?</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {optionCards.map((option) => (
                  <AiOptionCard
                    key={option.label}
                    label={option.label}
                    description={option.description}
                    inProgress={option.inProgress}
                    disabled={option.disabled}
                    registration={option.registration}
                  />
                ))}
              </div>
            </div>

            {creditCost.isLoading && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Loading current credit costs…
              </div>
            )}

            {creditCost.errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {creditCost.errorMessage}
              </div>
            )}

            {aiTemplateMutation.isError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {getErrorMessage(aiTemplateMutation.error)}
              </div>
            )}
          </fieldset>
        </div>

        <DialogFooter className="flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>

          <div className="flex flex-col items-end gap-1">
            {creditCost.insufficientBalance && creditCost.balance !== null && creditCost.totalCost !== null && (
              <p className="text-sm text-red-600">
                Insufficient balance. You need {creditCost.totalCost} credits, but you have {creditCost.balance}.
              </p>
            )}

            <Button type="button" onClick={handleSubmit} disabled={!canSubmit} className="min-w-[220px]">
              {submitButtonLabel}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

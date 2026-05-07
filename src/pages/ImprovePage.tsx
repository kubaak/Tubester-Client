import { useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { VideoSelect } from '@/feautures/videos/components/VideoSelect';
import { useRadixConfirmDialog } from '@/components/dialogs/useRadixConfirmDialog';
import { useGetApiVideosVideoId } from '@/api/videos/videos';
import { VideoVisibility, type AiVideoTemplateRequest } from '@/api';
import { AiOptionCard } from '@/feautures/videos/components/AiOptionCard';
import { useAiTemplateOperationMutation } from '@/feautures/videos/hooks/useAiTemplateOperationMutation';

type GenerateFormValues = {
  targetVideoId: string;
  promptEnrichment: string;
  generateTitle: boolean;
  generateDescription: boolean;
  generateTags: boolean;
  suggestPlaylists: boolean;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Failed to generate suggestions.';
}

const DEFAULT_VISIBILITIES = [VideoVisibility.Unlisted];

export default function ImprovePage() {
  const navigate = useNavigate();
  const { confirm, confirmDialog } = useRadixConfirmDialog();
  const aiTemplateMutation = useAiTemplateOperationMutation();

  const isGeneratingRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { control, register, handleSubmit, watch, setValue } = useForm<GenerateFormValues>({
    defaultValues: {
      targetVideoId: '',
      promptEnrichment: '',
      generateTitle: true,
      generateDescription: true,
      generateTags: true,
      suggestPlaylists: true,
    },
  });

  const targetVideoId = watch('targetVideoId');
  const promptEnrichment = watch('promptEnrichment');
  const generateTitle = watch('generateTitle');
  const generateDescription = watch('generateDescription');
  const generateTags = watch('generateTags');
  const suggestPlaylists = watch('suggestPlaylists');

  const videoDetailsQuery = useGetApiVideosVideoId(targetVideoId, {
    query: {
      enabled: targetVideoId.length > 0,
    },
  });

  const videoDetails = videoDetailsQuery.data?.data;

  const isTitleInProgress = videoDetails?.isAiTitleInProgress === true;
  const isDescriptionInProgress = videoDetails?.isAiDescriptionInProgress === true;
  const isTagsInProgress = videoDetails?.isAiTagsInProgress === true;
  const isPlaylistSuggestionInProgress = videoDetails?.isAiPlaylistSuggestionInProgress === true;

  const canSelectTitle = !isTitleInProgress;
  const canSelectDescription = !isDescriptionInProgress;
  const canSelectTags = !isTagsInProgress;
  const canSelectPlaylists = !isPlaylistSuggestionInProgress;

  const hasSelectedAvailableOperation =
    (generateTitle && canSelectTitle) ||
    (generateDescription && canSelectDescription) ||
    (generateTags && canSelectTags) ||
    (suggestPlaylists && canSelectPlaylists);

  const hasPromptEnrichment = promptEnrichment.trim().length > 0;

  const canGenerate = targetVideoId.length > 0 && hasPromptEnrichment && !isGenerating && hasSelectedAvailableOperation;

  const onGenerate = handleSubmit(async (values) => {
    if (isGeneratingRef.current) {
      return;
    }

    isGeneratingRef.current = true;
    setIsGenerating(true);

    const operationId = crypto.randomUUID();

    try {
      const request: AiVideoTemplateRequest = {
        targetVideoId: values.targetVideoId,
        promptEnrichment: values.promptEnrichment.trim(),
        generateTitle: values.generateTitle && canSelectTitle,
        generateDescription: values.generateDescription && canSelectDescription,
        generateTags: values.generateTags && canSelectTags,
        suggestPlaylists: values.suggestPlaylists && canSelectPlaylists,
      };

      const hasAnyRequestedOperation =
        request.generateTitle || request.generateDescription || request.generateTags || request.suggestPlaylists;

      if (!hasAnyRequestedOperation) {
        return;
      }

      const ok = await confirm('Improve this video with AI?');
      if (!ok) {
        return;
      }

      await aiTemplateMutation.mutateAsync({
        data: request,
        operationId,
      });

      navigate(`/review?videoId=${encodeURIComponent(values.targetVideoId)}`);
    } catch {
      // Error is displayed below.
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
    }
  });

  const optionCards = useMemo(
    () => [
      {
        label: 'Title',
        description: 'Make stronger, more clickable title.',
        inProgress: isTitleInProgress,
        disabled: !canSelectTitle,
        registration: register('generateTitle'),
      },
      {
        label: 'Description',
        description: 'Make clearer, more useful video description.',
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
        label: 'Suggest Playlists',
        description: 'Suggest playlists to add this video to.',
        inProgress: isPlaylistSuggestionInProgress,
        disabled: !canSelectPlaylists,
        registration: register('suggestPlaylists'),
      },
    ],
    [
      canSelectDescription,
      canSelectPlaylists,
      canSelectTags,
      canSelectTitle,
      isDescriptionInProgress,
      isPlaylistSuggestionInProgress,
      isTagsInProgress,
      isTitleInProgress,
      register,
    ],
  );

  return (
    <div className="min-h-full bg-slate-50/70">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Improve your video with AI
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Select a video that you want to improve, add a short description or context, and let AI prepare title,
            description, tag, and playlist suggestions for you. You’ll review and edit everything before anything is
            applied.
          </p>
        </div>

        <form className="space-y-6" onSubmit={onGenerate}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6">
              <Controller
                control={control}
                name="targetVideoId"
                render={({ field }) => (
                  <VideoSelect
                    label="Choose your video"
                    value={field.value}
                    defaultVisibilities={DEFAULT_VISIBILITIES}
                    onChange={field.onChange}
                    onSelect={(video) => {
                      const currentPrompt = promptEnrichment.trim();

                      if (!currentPrompt && video.title) {
                        setValue('promptEnrichment', video.title, {
                          shouldDirty: true,
                          shouldTouch: true,
                        });
                      }
                    }}
                    placeholder="Start typing or pick a video…"
                    disabled={isGenerating}
                  />
                )}
              />

              <fieldset disabled={isGenerating} className="space-y-6">
                <div>
                  <label htmlFor="promptEnrichment" className="block text-sm font-medium text-slate-900">
                    Tell the AI what this video is about
                  </label>

                  <p className="mt-1 text-sm text-slate-500">
                    Add context, audience, tone, keywords, or anything you want the AI to consider.
                  </p>

                  <textarea
                    id="promptEnrichment"
                    {...register('promptEnrichment')}
                    rows={5}
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                    placeholder="e.g., Funny cat compilation"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="mb-4">
                    <h2 className="text-sm font-semibold text-slate-900">What should the AI improve?</h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Choose which parts you want to improve. You can select one, several, or all available options.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

                {aiTemplateMutation.isError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {getErrorMessage(aiTemplateMutation.error)}
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Suggestions will open in review so you can edit them before applying.
                  </p>

                  <button
                    type="submit"
                    disabled={!canGenerate}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isGenerating ? 'Improving video…' : 'Improve video'}
                  </button>
                </div>
              </fieldset>
            </div>
          </div>
        </form>

        {confirmDialog}
      </div>
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { VideoSelect } from '@/feautures/videos/components/VideoSelect';
import { PlaylistSelect } from '@/feautures/videos/components/PlaylistSelect';
import { useRadixConfirmDialog } from '@/components/dialogs/useRadixConfirmDialog';
import {
  getGetApiVideosVideoIdQueryKey,
  useGetApiVideosVideoId,
  usePostApiVideosSaveDraft,
  usePostApiVideosUpdate,
} from '@/api/videos/videos';
import { VideoVisibility, type PlaylistDto, type UpdateVideoMetadataRequest } from '@/api';

import { useVideoIdParam } from '@/feautures/videos/hooks/useVideoIdParam';
import { useVideoSnapshotSync } from '@/feautures/videos/hooks/useVideoSnapshotSync';

type ReviewFormValues = {
  title: string;
  description: string;
  tagsText: string;
};

function toTags(tagsText: string): string[] {
  return tagsText
    .split(/[\n,]/g)
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function toPlaylistIds(playlists: PlaylistDto[]): string[] {
  return playlists.map((playlist) => playlist.id).filter((id): id is string => Boolean(id));
}

export default function ReviewPage() {
  const queryClient = useQueryClient();
  const { confirm, confirmDialog } = useRadixConfirmDialog();
  const { videoId, setVideoId } = useVideoIdParam();

  const saveDraftMutation = usePostApiVideosSaveDraft();
  const updateVideoMutation = usePostApiVideosUpdate();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<ReviewFormValues>({
    defaultValues: {
      title: '',
      description: '',
      tagsText: '',
    },
  });

  const videoDetailsQuery = useGetApiVideosVideoId(videoId, {
    query: {
      enabled: videoId.length > 0,
      refetchOnWindowFocus: false,
      refetchInterval: (query) => {
        const data = query.state.data?.data;
        if (
          data?.isAiTitleInProgress === true ||
          data?.isAiDescriptionInProgress === true ||
          data?.isAiTagsInProgress === true ||
          data?.isAiPlaylistSuggestionInProgress === true
        ) {
          return 5000;
        }
        return false;
      },
    },
  });

  const videoDetails = videoDetailsQuery.data?.data;

  const isAiTitleInProgress = videoDetails?.isAiTitleInProgress === true;
  const isAiDescriptionInProgress = videoDetails?.isAiDescriptionInProgress === true;
  const isAiTagsInProgress = videoDetails?.isAiTagsInProgress === true;
  const isAiPlaylistSuggestionInProgress = videoDetails?.isAiPlaylistSuggestionInProgress === true;
  const isAiInProgress =
    isAiTitleInProgress || isAiDescriptionInProgress || isAiTagsInProgress || isAiPlaylistSuggestionInProgress;
  const isFormLocked = isAiInProgress;

  const [selectedPlaylists, setSelectedPlaylists] = useState<PlaylistDto[]>([]);
  const [arePlaylistsDirty, setArePlaylistsDirty] = useState(false);

  useEffect(() => {
    if (!videoDetails) {
      setSelectedPlaylists([]);
      setArePlaylistsDirty(false);
      return;
    }

    setSelectedPlaylists(videoDetails.playlists ?? []);
    setArePlaylistsDirty(false);
  }, [videoId, videoDetails]);

  useVideoSnapshotSync({
    videoDetails,
    videoId,
    isDirty,
    getValues,
    reset,
  });

  const handleVideoChange = useCallback(
    async (nextVideoId: string) => {
      if (isDirty || arePlaylistsDirty) {
        const ok = await confirm('You have unsaved changes. Switch video and discard them?');
        if (!ok) return;
      }

      setVideoId(nextVideoId);
    },
    [isDirty, arePlaylistsDirty, confirm, setVideoId],
  );

  const handlePlaylistRemove = useCallback((playlistId: string) => {
    setSelectedPlaylists((current) => current.filter((playlist) => playlist.id !== playlistId));
    setArePlaylistsDirty(true);
  }, []);

  const canSubmit = videoId.length > 0 && !isFormLocked;
  const hasUnsavedChanges = isDirty || arePlaylistsDirty;

  const buildRequest = (values: ReviewFormValues): UpdateVideoMetadataRequest => ({
    videoId,
    title: values.title.trim().length === 0 ? null : values.title.trim(),
    description: values.description.trim().length === 0 ? null : values.description,
    tags: toTags(values.tagsText),
    playlistIds: toPlaylistIds(selectedPlaylists),
  });

  const onSaveDraft = handleSubmit(async (values) => {
    const ok = await confirm('Save these changes as a draft?');
    if (!ok) return;

    await saveDraftMutation.mutateAsync({ data: buildRequest(values) });
    await queryClient.invalidateQueries({ queryKey: getGetApiVideosVideoIdQueryKey(videoId) });

    setArePlaylistsDirty(false);
  });

  const onSubmitToYouTube = handleSubmit(async (values) => {
    const ok = await confirm('Submit these changes to YouTube?');
    if (!ok) return;

    await updateVideoMutation.mutateAsync({ data: buildRequest(values) });
    await queryClient.invalidateQueries({ queryKey: getGetApiVideosVideoIdQueryKey(videoId) });

    setArePlaylistsDirty(false);
  });

  const defaultVisibilities = useMemo(() => [VideoVisibility.Unlisted], []);

  return (
    <div className="min-h-full bg-slate-50/70">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Review video details</h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Review and edit your title, description, tags, and playlists before saving a draft or sending the changes to
            YouTube.
          </p>
        </div>

        <form className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-6">
              <div>
                <VideoSelect
                  label="Select a video to load its current details"
                  value={videoId}
                  defaultVisibilities={defaultVisibilities}
                  onChange={handleVideoChange}
                  placeholder="Start typing or pick a video…"
                  disabled={saveDraftMutation.isPending || updateVideoMutation.isPending}
                />
              </div>

              {isAiInProgress && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  AI suggestions are still being prepared. Editing is temporarily locked until generation is complete.
                </div>
              )}

              {videoId ? (
                <fieldset className="space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-4">
                      <h2 className="text-sm font-semibold text-slate-900">Video details</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Make any final edits before saving or publishing your changes.
                      </p>
                    </div>

                    {videoDetailsQuery.isLoading ? (
                      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                        Loading video details…
                      </div>
                    ) : videoDetailsQuery.isError ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        Failed to load video details.
                      </div>
                    ) : (
                      <div className="grid gap-5">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-slate-900">
                            Title
                          </label>
                          <input
                            id="title"
                            type="text"
                            {...register('title')}
                            disabled={isAiTitleInProgress}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-slate-900">
                            Description
                          </label>
                          <textarea
                            id="description"
                            {...register('description')}
                            rows={8}
                            disabled={isAiDescriptionInProgress}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                        </div>

                        <div>
                          <label htmlFor="tagsText" className="block text-sm font-medium text-slate-900">
                            Tags
                          </label>
                          <p className="mt-1 text-sm text-slate-500">Enter tags separated by commas or new lines.</p>
                          <textarea
                            id="tagsText"
                            {...register('tagsText')}
                            rows={4}
                            disabled={isAiTagsInProgress}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                            placeholder="tutorial, youtube growth, creator tips"
                          />
                        </div>

                        <PlaylistSelect
                          playlists={selectedPlaylists}
                          onRemove={handlePlaylistRemove}
                          disabled={isAiPlaylistSuggestionInProgress}
                        />
                      </div>
                    )}
                  </div>

                  {saveDraftMutation.isSuccess && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Draft saved successfully.
                    </div>
                  )}

                  {saveDraftMutation.isError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {(saveDraftMutation.error as any)?.message ?? 'Failed to save draft.'}
                    </div>
                  )}

                  {updateVideoMutation.isSuccess && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      Changes were submitted to YouTube successfully.
                    </div>
                  )}

                  {updateVideoMutation.isError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {(updateVideoMutation.error as any)?.message ?? 'Failed to submit changes to YouTube.'}
                    </div>
                  )}

                  <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-slate-500">
                        Save a draft to continue later, or submit your final changes to YouTube now.
                      </p>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          onClick={onSaveDraft}
                          disabled={!canSubmit || isSubmitting || saveDraftMutation.isPending || !hasUnsavedChanges}
                          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {saveDraftMutation.isPending ? 'Saving draft…' : 'Save draft'}
                        </button>

                        <button
                          type="button"
                          onClick={onSubmitToYouTube}
                          disabled={!canSubmit || isSubmitting || updateVideoMutation.isPending}
                          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {updateVideoMutation.isPending ? 'Submitting…' : 'Submit to YouTube'}
                        </button>
                      </div>
                    </div>
                  </div>
                </fieldset>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-sm text-slate-500">
                  <p className="font-medium text-slate-700">Choose a video to get started</p>
                  <p className="mt-2">
                    Once selected, you'll be able to review the title, description, tags, and playlists, then save a
                    draft or submit the changes to YouTube.
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>

        {confirmDialog}
      </div>
    </div>
  );
}

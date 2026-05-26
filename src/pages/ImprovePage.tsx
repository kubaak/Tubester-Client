import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { VideoVisibility, type VideoDetailsDto, type VideoListItemDto } from '@/api';
import {
  useGetApiVideosVideoId,
  getGetApiVideosVideoIdQueryKey,
  usePostApiVideosUpdate,
  usePostApiVideosSaveDraft,
  usePostApiVideosResync,
} from '@/api/videos/videos';

import { VideoSelect } from '@/feautures/videos/components/VideoSelect';

import { useVideoSnapshotSync } from '@/feautures/videos/improve/hooks/useVideoSnapshotSync';
import { useVideoIdParam } from '@/feautures/videos/hooks/useVideoIdParam';

import { AiDialog } from '@/feautures/videos/improve/components/AiDialog';
import { DetailsForm } from '@/feautures/videos/improve/components/DetailsForm';
import { Actions } from '@/feautures/videos/improve/components/Actions';
import { ProgressBanner } from '@/feautures/videos/improve/components/ProgressBanner';
import { ImproveWithAiCard } from '@/feautures/videos/improve/components/ImproveWithAiCard';
import type { VideoFormFields } from '@/feautures/videos/improve/types/VideoFormFields';
import { isAnyAiOperationInProgress } from '@/feautures/videos/utils/isAnyAiOperationInProgress';
import { ResyncVideoDialog } from '@/feautures/videos/improve/components/ResyncVideoDialog';

function parseTags(tagsText: string): string[] {
  return tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong.';
}

function areAllAiOperationsInProgress(videoDetails: VideoDetailsDto | undefined): boolean {
  if (!videoDetails) {
    return false;
  }

  return (
    videoDetails.isAiTitleInProgress === true &&
    videoDetails.isAiDescriptionInProgress === true &&
    videoDetails.isAiTagsInProgress === true &&
    videoDetails.isAiPlaylistSuggestionInProgress === true
  );
}

export default function ImprovePage() {
  const queryClient = useQueryClient();

  const { videoId: selectedVideoId, setVideoId: setSelectedVideoId } = useVideoIdParam();
  const [isImproveDialogOpen, setIsImproveDialogOpen] = useState(false);
  const [isResyncDialogOpen, setIsResyncDialogOpen] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);

  const form = useForm<VideoFormFields>({
    defaultValues: {
      title: '',
      description: '',
      tagsText: '',
      playlistIds: [],
    },
  });

  const videoDetailsQuery = useGetApiVideosVideoId(selectedVideoId, {
    query: {
      enabled: selectedVideoId.length > 0,
      refetchInterval: (query) => {
        const videoDetails = query.state.data?.data;

        return isAnyAiOperationInProgress(videoDetails) ? 3000 : false;
      },
    },
  });

  const videoDetails: VideoDetailsDto | undefined = videoDetailsQuery.data?.data;

  const saveDraftMutation = usePostApiVideosSaveDraft();
  const submitMutation = usePostApiVideosUpdate();
  const resyncMutation = usePostApiVideosResync();

  const isAiInProgress = isAnyAiOperationInProgress(videoDetails);
  const isAiButtonDisabled = areAllAiOperationsInProgress(videoDetails);

  const disabledFields = useMemo(
    () => ({
      title: videoDetails?.isAiTitleInProgress === true,
      description: videoDetails?.isAiDescriptionInProgress === true,
      tags: videoDetails?.isAiTagsInProgress === true,
      playlists: videoDetails?.isAiPlaylistSuggestionInProgress === true,
    }),
    [videoDetails],
  );

  useVideoSnapshotSync({
    videoDetails,
    videoId: selectedVideoId,
    isDirty: form.formState.isDirty,
    getValues: form.getValues,
    reset: form.reset,
  });

  const invalidateVideoDetails = async () => {
    if (!selectedVideoId) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: getGetApiVideosVideoIdQueryKey(selectedVideoId),
    });
  };

  const handleVideoSelected = (videoId: string) => {
    setSelectedVideoId(videoId);
    setPageError(null);
  };

  const buildUpdateRequest = () => {
    return {
      videoId: selectedVideoId,
    };
  };

  const buildSaveDraftRequest = () => {
    const values = form.getValues();

    return {
      videoId: selectedVideoId,
      title: values.title,
      description: values.description,
      tags: parseTags(values.tagsText),
      playlistIds: values.playlistIds,
    };
  };

  const handleSaveDraft = async () => {
    if (!selectedVideoId) {
      return;
    }

    setPageError(null);

    try {
      await saveDraftMutation.mutateAsync({
        data: buildSaveDraftRequest(),
      });

      form.reset(form.getValues());
      await invalidateVideoDetails();
    } catch (error) {
      setPageError(getErrorMessage(error));
    }
  };

  const handleSubmitToYouTube = async () => {
    if (!selectedVideoId) {
      return;
    }

    setPageError(null);

    try {
      await saveDraftMutation.mutateAsync({
        data: buildSaveDraftRequest(),
      });

      await submitMutation.mutateAsync({
        data: buildUpdateRequest(),
      });

      form.reset(form.getValues());
      await invalidateVideoDetails();
    } catch (error) {
      setPageError(getErrorMessage(error));
    }
  };

  const handleImproveSuccess = async () => {
    setIsImproveDialogOpen(false);
    await invalidateVideoDetails();
  };

  const handleResyncClick = () => {
    setIsResyncDialogOpen(true);
  };

  const handleResyncConfirm = async () => {
    if (!selectedVideoId) {
      return;
    }

    setIsResyncDialogOpen(false);
    setPageError(null);

    try {
      await resyncMutation.mutateAsync({
        params: { videoId: selectedVideoId },
      });

      await invalidateVideoDetails();
    } catch (error) {
      setPageError(getErrorMessage(error));
    }
  };

  const initialSelectedVideo = useMemo<VideoListItemDto | null>(() => {
    if (!videoDetails || !selectedVideoId) {
      return null;
    }

    return {
      videoId: selectedVideoId,
      title: videoDetails.title,
      thumbnailUrl: videoDetails.thumbnailUrl,
    };
  }, [videoDetails, selectedVideoId]);

  const defaultVisibilities = useMemo(() => [VideoVisibility.Unlisted], []);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">Improve your video with AI</h1>
        <p className="mt-1 text-sm text-slate-500">
          Select a video that you want to improve, add a short description or context, and let AI prepare title,
          description, tag, and playlist suggestions for you. You'll review and edit everything before anything is
          applied.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <VideoSelect
          label="Select a video"
          value={selectedVideoId}
          onChange={handleVideoSelected}
          defaultVisibilities={defaultVisibilities}
          initialVideo={initialSelectedVideo}
        />
      </div>

      {selectedVideoId && videoDetailsQuery.isLoading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">
          Loading video details...
        </div>
      )}

      {selectedVideoId && videoDetailsQuery.isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          Failed to load video details.
        </div>
      )}

      {pageError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{pageError}</div>
      )}

      {videoDetails && (
        <>
          <ImproveWithAiCard isAiInProgress={isAiButtonDisabled} onImproveClick={() => setIsImproveDialogOpen(true)} />

          <ProgressBanner videoDetails={videoDetails} />

          <DetailsForm
            register={form.register}
            watch={form.watch}
            setValue={form.setValue}
            disabledFields={disabledFields}
            onResyncClick={handleResyncClick}
            isResyncing={resyncMutation.isPending}
          />

          <ResyncVideoDialog
            open={isResyncDialogOpen}
            isResyncing={resyncMutation.isPending}
            onOpenChange={setIsResyncDialogOpen}
            onConfirm={handleResyncConfirm}
          />

          <Actions
            isDirty={form.formState.isDirty}
            isSaving={saveDraftMutation.isPending}
            isSubmitting={submitMutation.isPending}
            disabled={isAiInProgress}
            onSaveDraft={handleSaveDraft}
            onSubmitToYouTube={handleSubmitToYouTube}
          />

          <AiDialog
            open={isImproveDialogOpen}
            onOpenChange={setIsImproveDialogOpen}
            videoId={selectedVideoId}
            videoTitle={videoDetails.title}
            videoDetails={videoDetails}
            onSuccess={handleImproveSuccess}
          />
        </>
      )}
    </div>
  );
}

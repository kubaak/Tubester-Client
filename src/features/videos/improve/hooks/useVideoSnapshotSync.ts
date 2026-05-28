import { useEffect, useRef } from 'react';
import type { UseFormGetValues, UseFormReset } from 'react-hook-form';
import type { VideoDetailsDto } from '@/api';
import type { VideoFormFields } from '../types/VideoFormFields';
import { isAnyAiOperationInProgress } from '../../utils/isAnyAiOperationInProgress';

export function fromVideoDetails(videoDetails: VideoDetailsDto): VideoFormFields {
  return {
    title: videoDetails.title ?? '',
    description: videoDetails.description ?? '',
    tagsText: (videoDetails.tags ?? []).join(', '),
    playlistIds: (videoDetails.playlists ?? [])
      .map((playlist) => playlist.id)
      .filter((id): id is string => Boolean(id)),
  };
}

type UseVideoSnapshotSyncOptions<TForm extends VideoFormFields> = {
  videoDetails: VideoDetailsDto | undefined;
  videoId: string;
  isDirty: boolean;
  getValues: UseFormGetValues<TForm>;
  reset: UseFormReset<TForm>;
};

/**
 * Safely syncs server video snapshot into form fields.
 *
 * Overwrites form when:
 * - AI generation is running
 * - AI generation just finished
 * - form is not dirty
 * - selected video changed
 */
export function useVideoSnapshotSync<TForm extends VideoFormFields>({
  videoDetails,
  videoId,
  isDirty,
  getValues,
  reset,
}: UseVideoSnapshotSyncOptions<TForm>) {
  const lastLoadedVideoIdRef = useRef('');
  const lastInProgressRef = useRef(false);

  useEffect(() => {
    if (!videoDetails || videoId.length === 0) {
      return;
    }

    const isTargetChanged = lastLoadedVideoIdRef.current !== videoId;
    const wasInProgress = lastInProgressRef.current;
    const isNowInProgress = isAnyAiOperationInProgress(videoDetails);

    const aiJustFinished = wasInProgress && !isNowInProgress;
    const shouldOverwrite = isTargetChanged || isNowInProgress || aiJustFinished || !isDirty;

    if (shouldOverwrite) {
      const currentValues = getValues();

      reset({
        ...currentValues,
        ...fromVideoDetails(videoDetails),
      } as TForm);
    }

    lastLoadedVideoIdRef.current = videoId;
    lastInProgressRef.current = isNowInProgress;
  }, [videoDetails, videoId, isDirty, getValues, reset]);
}
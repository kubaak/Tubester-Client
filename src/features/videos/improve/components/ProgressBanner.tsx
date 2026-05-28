import type { VideoDetailsDto } from '@/api';

export type ProgressBannerProps = {
  videoDetails: VideoDetailsDto | undefined;
};

function getRunningAiOperations(videoDetails: VideoDetailsDto | undefined): string[] {
  if (!videoDetails) {
    return [];
  }

  const operations: string[] = [];

  if (videoDetails.isAiTitleInProgress === true) {
    operations.push('title');
  }

  if (videoDetails.isAiDescriptionInProgress === true) {
    operations.push('description');
  }

  if (videoDetails.isAiTagsInProgress === true) {
    operations.push('tags');
  }

  if (videoDetails.isAiPlaylistSuggestionInProgress === true) {
    operations.push('playlists');
  }

  return operations;
}

export function ProgressBanner({ videoDetails }: ProgressBannerProps) {
  const runningOperations = getRunningAiOperations(videoDetails);

  if (runningOperations.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-900">
      <div className="font-medium">AI improvement in progress</div>
      <div className="mt-1 text-violet-800">
        Tubester is working on {runningOperations.join(', ')}. These fields are locked until generation finishes.
      </div>
    </div>
  );
}

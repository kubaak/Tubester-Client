import type { VideoDetailsDto } from "@/api/videoDetailsDto";

export function isAnyAiOperationInProgress(videoDetails: VideoDetailsDto | undefined): boolean {
  return (
    videoDetails?.isAiTitleInProgress === true ||
    videoDetails?.isAiDescriptionInProgress === true ||
    videoDetails?.isAiTagsInProgress === true ||
    videoDetails?.isAiPlaylistSuggestionInProgress === true
  );
}
import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const VIDEO_ID_PARAM = 'videoId';

export function useVideoIdParam() {
  const [searchParams, setSearchParams] = useSearchParams();

  const videoId = searchParams.get(VIDEO_ID_PARAM)?.trim() ?? '';

  const setVideoId = useCallback(
    (nextVideoId: string) => {
      const normalizedVideoId = nextVideoId.trim();

      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);

          if (normalizedVideoId.length > 0) {
            next.set(VIDEO_ID_PARAM, normalizedVideoId);
          } else {
            next.delete(VIDEO_ID_PARAM);
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  return { videoId, setVideoId } as const;
}
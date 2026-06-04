import { useNavigate } from 'react-router-dom';

import type { VideoListItemDto } from '@/api';
import { useGetApiVideosDirty } from '@/api/videos/videos';
import { VideoItem } from '@/features/videos/components/VideoItem';

export function PendingImprovementsVideosBlock() {
  const navigate = useNavigate();
  const { data: videos, isLoading, isError } = useGetApiVideosDirty();

  const handleVideoClick = (video: VideoListItemDto) => {
    navigate({ pathname: '/improve', search: `?videoId=${video.videoId}` });
  };

  return (
    <section className="glass rounded-3xl border border-border/50 p-6 shadow-moderate">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-foreground">Pending improvements</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review these videos to finish pending improvements.</p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading videos…</p>}

      {isError && <p className="text-sm text-destructive">Failed to load videos with pending improvements.</p>}

      {videos?.data.length === 0 && (
        <p className="text-sm text-muted-foreground">No videos have pending improvements right now.</p>
      )}

      {videos && videos.data.length > 0 && (
        <ul className="space-y-2">
          {videos.data.map((video) => (
            <li key={video.videoId}>
              <VideoItem video={video} onClick={handleVideoClick} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

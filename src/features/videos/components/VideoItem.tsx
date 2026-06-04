import { Check } from 'lucide-react';
import type { VideoListItemDto } from '@/api';
import { cn } from '@/lib/cn';

type Props = {
  video: VideoListItemDto;
  selected?: boolean;
  onClick?: (video: VideoListItemDto) => void;
};

export function VideoItem({ video, selected = false, onClick }: Props) {
  const videoId = video.videoId;
  const title = video.title ?? videoId;

  return (
    <button
      type="button"
      className={cn(
        'w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-gray-100 text-left',
        selected && 'bg-gray-100',
      )}
      onClick={() => onClick?.(video)}
    >
      {video.thumbnailUrl && (
        <img src={video.thumbnailUrl} alt="" className="w-12 h-7 rounded object-cover border" loading="lazy" />
      )}

      <div className="min-w-0 flex-1">
        <div className="truncate" title={title}>
          {title}
        </div>

        {video.publishedAt && (
          <div className="text-xs text-gray-500">{new Date(video.publishedAt).toLocaleDateString()}</div>
        )}
      </div>

      {selected && <Check className="w-4 h-4 text-primary" />}
    </button>
  );
}

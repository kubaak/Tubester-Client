import type { VideoListItemDto } from '@/api';
import { VideoItem } from './VideoItem';

type Props = {
  items: readonly VideoListItemDto[];
  isPending: boolean;
  value?: string;
  onChange: (video: VideoListItemDto) => void;
  nextPageToken?: string;
  onLoadMore: () => void;
};

export function VideoSelectList({ items, isPending, value, onChange, nextPageToken, onLoadMore }: Props) {
  const showEmptyState = items.length === 0;
  const showLoadMore = items.length > 0 || isPending;

  return (
    <>
      {/* List */}
      <div className="max-h-80 overflow-auto p-1">
        {showEmptyState ? (
          <div className="p-3 text-sm text-gray-500">{isPending ? 'Loading…' : 'No videos match your filter.'}</div>
        ) : (
          <ul className="space-y-1">
            {items.map((video) => (
              <li key={video.videoId}>
                <VideoItem video={video} selected={video.videoId === value} onClick={onChange} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Load more */}
      {showLoadMore && (
        <div className="p-2 border-t">
          <button
            type="button"
            className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={!nextPageToken || isPending}
            onClick={onLoadMore}
          >
            {isPending ? 'Loading…' : nextPageToken ? 'Load more' : 'No more videos'}
          </button>
        </div>
      )}
    </>
  );
}

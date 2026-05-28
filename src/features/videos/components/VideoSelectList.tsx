import { Check } from 'lucide-react';
import type { VideoListItemDto } from '@/api';
import { cn } from '@/lib/cn';

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
            {items.map((v) => {
              const videoId = v.videoId;
              const active = videoId === value;

              return (
                <li key={videoId}>
                  <button
                    type="button"
                    className={cn(
                      'w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-gray-100 text-left',
                      active && 'bg-gray-100',
                    )}
                    onClick={() => onChange(v)}
                  >
                    {v.thumbnailUrl && (
                      <img
                        src={v.thumbnailUrl}
                        alt=""
                        className="w-12 h-7 rounded object-cover border"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate" title={v.title ?? videoId}>
                        {v.title ?? videoId}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {v.publishedAt && <div>{new Date(v.publishedAt).toLocaleDateString()}</div>}
                      </div>
                    </div>
                    {active && <Check className="w-4 h-4 text-primary" />}
                  </button>
                </li>
              );
            })}
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

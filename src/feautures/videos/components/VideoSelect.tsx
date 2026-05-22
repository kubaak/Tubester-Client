import { useEffect, useMemo, useRef, useState } from 'react';
import { usePostApiVideosSearch } from '@/api/videos/videos';
import { VideoVisibility } from '@/api';
import type { GetVideosRequest, VideoListItemDto, VideoVisibility as VideoVisibilityValue } from '@/api';
import { cn } from '@/lib/cn';
import { VideoSelectTrigger } from './VideoSelectTrigger';
import { VideoSelectFilters } from './VideoSelectFilters';
import { VideoSelectList } from './VideoSelectList';

type Props = {
  label: string;
  defaultVisibilities?: readonly VideoVisibilityValue[];
  showVisibilities?: boolean;
  value?: string;
  onChange: (videoId: string) => void;
  onSelect?: (video: VideoListItemDto) => void;
  initialVideo?: VideoListItemDto | null;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const DEBOUNCE_MS = 1000;
const ALL_VISIBILITIES = Object.values(VideoVisibility) as VideoVisibilityValue[];

export function VideoSelect({
  label,
  defaultVisibilities = ALL_VISIBILITIES,
  showVisibilities = true,
  value,
  onChange,
  onSelect,
  initialVideo,
  placeholder = 'Select a video…',
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);
  const [items, setItems] = useState<VideoListItemDto[]>([]);
  const [filter, setFilter] = useState('');
  const [debouncedFilter, setDebouncedFilter] = useState('');
  const [selectedVisibilities, setSelectedVisibilities] = useState<VideoVisibilityValue[]>(() => [
    ...defaultVisibilities,
  ]);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!initialVideo) {
      return;
    }

    setItems((previousItems) => {
      if (previousItems.some((item) => item.videoId === initialVideo.videoId)) {
        return previousItems;
      }

      return [initialVideo, ...previousItems];
    });
  }, [initialVideo]);

  // Debounce the text filter before sending to server (?title=)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedFilter(filter.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [filter]);

  useEffect(() => {
    setSelectedVisibilities([...defaultVisibilities]);
  }, [defaultVisibilities]);

  // Build request body for POST /api/videos/search (server-side filter + paging)
  const requestBody = useMemo<GetVideosRequest>(
    () => ({
      // only include title if non-empty
      title: debouncedFilter || undefined,
      pageToken: pageToken || undefined,
      visibility: selectedVisibilities.length === ALL_VISIBILITIES.length ? undefined : selectedVisibilities,
    }),
    [debouncedFilter, pageToken, selectedVisibilities],
  );

  // Fetch current page using POST mutation
  const { data, isPending, mutate } = usePostApiVideosSearch();

  // Trigger mutation when dropdown opens or filters/paging change
  useEffect(() => {
    if (open) {
      mutate({ data: requestBody });
    }
  }, [open, requestBody, mutate]);

  // Merge/replace items based on pageToken
  useEffect(() => {
    if (!data) return;
    const next = data.data.items ?? [];
    setItems((prev) => (pageToken ? [...prev, ...next] : next));
  }, [data, pageToken]);

  const nextPageToken = data?.data.nextPageToken ?? undefined;

  // Close on click outside (ignore clicks on trigger)
  useEffect(() => {
    if (!open) return;

    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      const panel = panelRef.current;
      const trigger = triggerRef.current;
      const clickedInsidePanel = !!panel && panel.contains(target);
      const clickedTrigger = !!trigger && trigger.contains(target);

      if (!clickedInsidePanel && !clickedTrigger) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  // Reset paging whenever the *debounced* server filter changes
  useEffect(() => {
    setPageToken(undefined);
    setItems(initialVideo ? [initialVideo] : []);
  }, [debouncedFilter, selectedVisibilities, initialVideo]);

  const selected = useMemo(() => items.find((i) => i.videoId === value), [items, value]);

  function toggleVisibility(visibility: VideoVisibilityValue) {
    setSelectedVisibilities((prev) => {
      if (prev.includes(visibility)) {
        if (prev.length === 1) {
          return prev;
        }

        return prev.filter((v) => v !== visibility);
      }

      return [...prev, visibility];
    });
  }

  function handleSelect(video: VideoListItemDto) {
    onChange(video.videoId);
    onSelect?.(video);
    setOpen(false);
  }

  return (
    <div className={cn('relative', className)}>
      <VideoSelectTrigger
        ref={triggerRef}
        label={label}
        selected={selected}
        placeholder={placeholder}
        disabled={disabled}
        open={open}
        onClick={() => setOpen((v) => !v)}
      />

      {open && (
        <div
          ref={panelRef}
          className="absolute z-50 mt-2 w-full max-h-[26rem] overflow-hidden rounded-xl border bg-white shadow-lg"
          role="listbox"
        >
          <VideoSelectFilters
            filter={filter}
            onFilterChange={setFilter}
            selectedVisibilities={selectedVisibilities}
            showVisibilities={showVisibilities}
            onVisibilityToggle={toggleVisibility}
          />

          <VideoSelectList
            items={items}
            isPending={isPending}
            value={value}
            onChange={handleSelect}
            nextPageToken={nextPageToken}
            onLoadMore={() => {
              if (!nextPageToken) return;
              setPageToken(nextPageToken);
            }}
          />
        </div>
      )}
    </div>
  );
}

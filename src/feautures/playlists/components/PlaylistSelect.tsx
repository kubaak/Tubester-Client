import { useEffect, useMemo, useRef, useState } from 'react';

import type { PlaylistDto } from '@/api';
import { useGetApiPlaylists } from '@/api/playlists/playlists';

import { PlaylistDropdown } from './PlaylistDropdown';
import { PlaylistTagsBox } from './PlaylistTagsBox';
import { PlaylistFieldHeader } from './PlaylistFieldHeader';

const PLAYLISTS_STALE_TIME_MS = 5 * 60 * 1000;

export type PlaylistSelectProps = {
  selectedPlaylistIds: string[];
  onChange: (playlistIds: string[]) => void;
  disabled?: boolean;
};

export function PlaylistSelect({ selectedPlaylistIds, onChange, disabled }: PlaylistSelectProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const { data: availablePlaylists, isPending: isLoadingPlaylists } = useGetApiPlaylists({
    query: {
      staleTime: PLAYLISTS_STALE_TIME_MS,
    },
  });

  const playlists = availablePlaylists?.data ?? [];

  const selectedIdSet = useMemo(() => new Set(selectedPlaylistIds), [selectedPlaylistIds]);

  const selectedPlaylists = useMemo(() => {
    return selectedPlaylistIds
      .map((playlistId) => playlists.find((playlist) => playlist.id === playlistId))
      .filter((playlist): playlist is PlaylistDto => playlist !== undefined);
  }, [selectedPlaylistIds, playlists]);

  const filteredPlaylists = useMemo(() => {
    const normalizedFilter = filter.trim().toLowerCase();

    return playlists.filter((playlist) => {
      if (selectedIdSet.has(playlist.id)) {
        return false;
      }

      if (normalizedFilter.length === 0) {
        return true;
      }

      return playlist.name?.toLowerCase().includes(normalizedFilter) === true;
    });
  }, [playlists, selectedIdSet, filter]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onDocMouseDown(event: MouseEvent) {
      const target = event.target as Node;

      const clickedInsidePanel = panelRef.current?.contains(target) === true;
      const clickedTrigger = triggerRef.current?.contains(target) === true;

      if (!clickedInsidePanel && !clickedTrigger) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const handleAdd = (playlistId: string) => {
    if (selectedIdSet.has(playlistId)) {
      return;
    }

    onChange([...selectedPlaylistIds, playlistId]);
    setOpen(false);
    setFilter('');
  };

  const handleRemove = (playlistId: string) => {
    onChange(selectedPlaylistIds.filter((id) => id !== playlistId));
  };

  return (
    <div>
      <PlaylistFieldHeader />

      <div className="relative mt-3 min-h-[60px] rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <PlaylistTagsBox
          selectedPlaylistIds={selectedPlaylistIds}
          selectedPlaylists={selectedPlaylists}
          disabled={disabled}
          triggerRef={triggerRef}
          onToggleOpen={() => setOpen((value) => !value)}
          onRemove={handleRemove}
        />

        {open && (
          <PlaylistDropdown
            panelRef={panelRef}
            filter={filter}
            onFilterChange={setFilter}
            isLoading={isLoadingPlaylists}
            playlists={filteredPlaylists}
            onAdd={handleAdd}
          />
        )}
      </div>
    </div>
  );
}

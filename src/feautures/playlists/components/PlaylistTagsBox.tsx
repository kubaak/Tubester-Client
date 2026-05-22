import { Plus } from 'lucide-react';

import type { PlaylistDto } from '@/api';
import { PlaylistTag } from './PlaylistTag';

export type PlaylistTagsBoxProps = {
  selectedPlaylistIds: string[];
  selectedPlaylists: PlaylistDto[];
  disabled?: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  onToggleOpen: () => void;
  onRemove: (playlistId: string) => void;
};

export function PlaylistTagsBox({
  selectedPlaylistIds,
  selectedPlaylists,
  disabled,
  triggerRef,
  onToggleOpen,
  onRemove,
}: PlaylistTagsBoxProps) {
  const isLoadingSelectedPlaylists = selectedPlaylistIds.length > 0 && selectedPlaylists.length === 0;

  if (isLoadingSelectedPlaylists) {
    return <p className="text-sm text-slate-400">Loading selected playlists…</p>;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {selectedPlaylists.length === 0 && <p className="mr-2 text-sm text-slate-400">No playlists</p>}

      {selectedPlaylists.map((playlist) => (
        <PlaylistTag key={playlist.id} playlist={playlist} onRemove={onRemove} disabled={disabled} />
      ))}

      {!disabled && (
        <button
          type="button"
          ref={triggerRef}
          onClick={onToggleOpen}
          aria-label="Add playlist"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-moderate transition hover:shadow-strong hover-lift focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

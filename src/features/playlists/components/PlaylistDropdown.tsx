import { Search } from 'lucide-react';

import type { PlaylistDto } from '@/api';

export type PlaylistDropdownProps = {
  panelRef: React.RefObject<HTMLDivElement | null>;
  filter: string;
  onFilterChange: (value: string) => void;
  isLoading: boolean;
  playlists: PlaylistDto[];
  onAdd: (playlistId: string) => void;
};

export function PlaylistDropdown({
  panelRef,
  filter,
  onFilterChange,
  isLoading,
  playlists,
  onAdd,
}: PlaylistDropdownProps) {
  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full z-50 mt-2 w-full max-w-sm rounded-xl border bg-white shadow-lg"
    >
      <div className="border-b border-slate-100 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            placeholder="Search playlists…"
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
          />
        </div>
      </div>

      <div className="max-h-60 overflow-y-auto p-1">
        {isLoading ? (
          <p className="p-3 text-sm text-slate-400">Loading playlists…</p>
        ) : playlists.length === 0 ? (
          <p className="p-3 text-sm text-slate-400">
            {filter ? 'No playlists match your search.' : 'No playlists available.'}
          </p>
        ) : (
          playlists.map((playlist) => (
            <button
              key={playlist.id}
              type="button"
              onClick={() => onAdd(playlist.id)}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 focus:bg-slate-100 focus:outline-none"
            >
              {playlist.name ?? 'Unnamed playlist'}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

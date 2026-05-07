import type { PlaylistDto } from '@/api';
import { PlaylistTag } from './PlaylistTag';

interface PlaylistSelectProps {
  playlists: PlaylistDto[];
  onRemove: (playlistId: string) => void;
  disabled?: boolean;
}

export function PlaylistSelect({ playlists, onRemove, disabled }: PlaylistSelectProps) {
  const visiblePlaylists = playlists.filter((playlist) => Boolean(playlist.id));

  return (
    <div>
      <label className="block text-sm font-medium text-slate-900">Playlists</label>

      <p className="mt-1 text-sm text-slate-500">Playlists this video belongs to.</p>

      <div className="mt-2 min-h-[60px] rounded-2xl border border-slate-200 bg-white px-4 py-3">
        {!visiblePlaylists.length ? (
          <p className="text-sm text-slate-400">No playlists</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {visiblePlaylists.map((playlist) => (
              <PlaylistTag key={playlist.id} playlist={playlist} onRemove={onRemove} disabled={disabled} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

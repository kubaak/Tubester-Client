import { X } from 'lucide-react';

import type { PlaylistDto } from '@/api';

interface PlaylistTagProps {
  playlist: PlaylistDto;
  onRemove: (playlistId: string) => void;
  disabled?: boolean;
}

export function PlaylistTag({ playlist, onRemove, disabled }: PlaylistTagProps) {
  const id = playlist.id;
  const name = playlist.name ?? 'Unnamed playlist';

  const handleRemove = () => {
    if (!id || !onRemove) return;

    onRemove(id);
  };

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
      {name}

      {!disabled && id && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-0.5 rounded-full p-0.5 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
          aria-label={`Remove ${name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

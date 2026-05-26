import type { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlaylistSelect } from '@/feautures/playlists/components/PlaylistSelect';
import type { VideoFormFields } from '../types/VideoFormFields';
import { Textarea } from '@/components/ui/Textarea';

export type DetailsFormProps = {
  register: UseFormRegister<VideoFormFields>;
  watch: UseFormWatch<VideoFormFields>;
  setValue: UseFormSetValue<VideoFormFields>;
  disabledFields: {
    title: boolean;
    description: boolean;
    tags: boolean;
    playlists: boolean;
  };
  onResyncClick: () => void;
  isResyncing: boolean;
};

export function DetailsForm({
  register,
  watch,
  setValue,
  disabledFields,
  onResyncClick,
  isResyncing,
}: DetailsFormProps) {
  const selectedPlaylistIds = (watch('playlistIds') ?? []) as string[];

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-medium text-slate-900">Video Details</h2>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onResyncClick}
          disabled={isResyncing}
          aria-label="Resync with latest YouTube data"
          title="Resync with latest YouTube data"
        >
          <RotateCcw className={isResyncing ? 'animate-spin' : ''} />
        </Button>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-900">
          Title
        </label>

        <Input id="title" className="mt-2" disabled={disabledFields.title} {...register('title')} />

        {disabledFields.title && <p className="mt-1 text-xs text-slate-500">AI is currently improving the title.</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-900">
          Description
        </label>

        <Textarea
          id="description"
          className="mt-2 min-h-[220px]"
          disabled={disabledFields.description}
          {...register('description')}
        />

        {disabledFields.description && (
          <p className="mt-1 text-xs text-slate-500">AI is currently improving the description.</p>
        )}
      </div>

      <div>
        <label htmlFor="tagsText" className="block text-sm font-medium text-slate-900">
          Tags
        </label>

        <Textarea
          id="tagsText"
          className="mt-2 min-h-[90px]"
          disabled={disabledFields.tags}
          placeholder="tag one, tag two, tag three"
          {...register('tagsText')}
        />

        {disabledFields.tags && <p className="mt-1 text-xs text-slate-500">AI is currently improving the tags.</p>}
      </div>

      <PlaylistSelect
        selectedPlaylistIds={selectedPlaylistIds}
        onChange={(playlistIds: string[]) =>
          setValue('playlistIds', playlistIds, {
            shouldDirty: true,
            shouldTouch: true,
          })
        }
        disabled={disabledFields.playlists}
      />
    </div>
  );
}

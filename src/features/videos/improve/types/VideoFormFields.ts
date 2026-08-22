import type { SaveVideoDraftRequest } from '@/api';

export type VideoFormFields = Pick<
  SaveVideoDraftRequest,
  'title' | 'description' | 'playlistIds'
> & {
  tagsText: string;
};

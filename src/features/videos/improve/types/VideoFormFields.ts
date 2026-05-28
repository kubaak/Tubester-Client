import type { UpdateVideoMetadataRequest } from '@/api';

export type VideoFormFields = Pick<
  UpdateVideoMetadataRequest,
  'title' | 'description' | 'playlistIds'
> & {
  tagsText: string;
};
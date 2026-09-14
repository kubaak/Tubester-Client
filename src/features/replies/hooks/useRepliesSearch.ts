import { useInfiniteQuery } from '@tanstack/react-query';

import type { ReplyListItemDto, SearchSuggestedRepliesRequest } from '@/api';
import { postApiRepliesSuggestedSearch } from '@/api/replies/replies';

export interface RepliesFilters {
  videoId?: string;
  originalComment?: string;
}

const DEFAULT_PAGE_SIZE = 3;

function normalizeFilters(filters: RepliesFilters): RepliesFilters {
  const videoId = filters.videoId?.trim();
  const originalComment = filters.originalComment?.trim();

  return {
    videoId: videoId || undefined,
    originalComment: originalComment || undefined,
  };
}

function buildRequest(filters: RepliesFilters, pageToken?: string | null): SearchSuggestedRepliesRequest {
  return {
    videoId: filters.videoId,
    originalComment: filters.originalComment,
    pageSize: DEFAULT_PAGE_SIZE,
    pageToken: pageToken || undefined,
  };
}

export function getRepliesQueryKey(filters: RepliesFilters) {
  const normalizedFilters = normalizeFilters(filters);

  return ['suggested-replies', normalizedFilters] as const;
}

export function useRepliesSearch(filters: RepliesFilters) {
  const normalizedFilters = normalizeFilters(filters);

  const query = useInfiniteQuery({
    queryKey: getRepliesQueryKey(normalizedFilters),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam }) => postApiRepliesSuggestedSearch(buildRequest(normalizedFilters, pageParam)),
    getNextPageParam: (lastPage) => lastPage.data.nextPageToken || undefined,
  });

  const replies: ReplyListItemDto[] = query.data?.pages.flatMap((page) => page.data.items ?? []) ?? [];
  const nextPageToken = query.data?.pages.at(-1)?.data.nextPageToken ?? null;

  return {
    replies,
    nextPageToken,
    isInitialLoading: query.isPending,
    isFetchingNextPage: query.isFetchingNextPage,
    error: query.error,
    fetchNextPage: query.fetchNextPage,
    refetch: query.refetch,
  };
}

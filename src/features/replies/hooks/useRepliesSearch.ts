import { useCallback, useRef, useState } from 'react';


import type { ReplyListItemDto, SearchSuggestedRepliesRequest } from '@/api';
import { usePostApiRepliesSuggestedSearch } from '@/api/replies/replies';

export interface RepliesFilters {
  videoId?: string;
  originalComment?: string;
}

interface UseRepliesSearchResult {
  replies: ReplyListItemDto[];
  nextPageToken: string | null;
  isInitialLoading: boolean;
  isFetchingNextPage: boolean;
  error: Error | null;
  fetchInitial: (filters: RepliesFilters) => Promise<void>;
  fetchNextPage: () => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 3;

export function useRepliesSearch(): UseRepliesSearchResult {
  const [replies, setReplies] = useState<ReplyListItemDto[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const currentFiltersRef = useRef<RepliesFilters>({});
  const requestIdRef = useRef(0);

  const { mutateAsync } = usePostApiRepliesSuggestedSearch();

  const buildRequest = useCallback(
    (filters: RepliesFilters, pageToken?: string | null): SearchSuggestedRepliesRequest => ({
      videoId: filters.videoId || undefined,
      originalComment: filters.originalComment?.trim() || undefined,
      pageSize: DEFAULT_PAGE_SIZE,
      pageToken: pageToken || undefined,
    }),
    [],
  );

  const fetchInitial = useCallback(
    async (filters: RepliesFilters) => {
      const requestId = ++requestIdRef.current;
      currentFiltersRef.current = filters;

      setIsInitialLoading(true);
      setIsFetchingNextPage(false);
      setError(null);
      setReplies([]);
      setNextPageToken(null);

      try {
        const response = await mutateAsync({
          data: buildRequest(filters),
        });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setReplies(response.data.items ?? []);
        setNextPageToken(response.data.nextPageToken ?? null);
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(err instanceof Error ? err : new Error('Failed to load replies'));
        setReplies([]);
        setNextPageToken(null);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsInitialLoading(false);
        }
      }
    },
    [buildRequest, mutateAsync],
  );

  const fetchNextPage = useCallback(async () => {
    if (isInitialLoading || isFetchingNextPage || nextPageToken === null) {
      return;
    }

    const requestId = requestIdRef.current;
    const currentPageToken = nextPageToken;

    setIsFetchingNextPage(true);
    setError(null);

    try {
      const response = await mutateAsync({
        data: buildRequest(currentFiltersRef.current, currentPageToken),
      });

      if (requestId !== requestIdRef.current) {
        return;
      }

      setReplies((prev) => [...prev, ...(response.data.items ?? [])]);
      setNextPageToken(response.data.nextPageToken ?? null);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setError(err instanceof Error ? err : new Error('Failed to load more replies'));
    } finally {
      if (requestId === requestIdRef.current) {
        setIsFetchingNextPage(false);
      }
    }
  }, [buildRequest, isFetchingNextPage, isInitialLoading, mutateAsync, nextPageToken]);

  return {
    replies,
    nextPageToken,
    isInitialLoading,
    isFetchingNextPage,
    error,
    fetchInitial,
    fetchNextPage,
  };
}
import { useEffect, useRef } from 'react';
import { Loader2, SearchX } from 'lucide-react';

import type { ReplyListItemDto } from '../../../api';
import { ReplyCard } from './ReplyCard';

interface RepliesContentProps {
  replies: ReplyListItemDto[];
  isInitialLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  selectedIds: Set<string>;
  onSelectionChange: (commentId: string, selected: boolean) => void;
  onApprove: (commentId: string) => void;
  onIgnore: (commentId: string) => void;
  isActionPending: boolean;
}

export function RepliesContent({
  replies,
  isInitialLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  selectedIds,
  onSelectionChange,
  onApprove,
  onIgnore,
  isActionPending,
}: RepliesContentProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll using IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  // Initial loading state
  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card px-5 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Loading replies...</p>
      </div>
    );
  }

  // Empty state
  if (replies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card px-5 py-16">
        <SearchX className="h-8 w-8 text-muted-foreground/60" />
        <p className="mt-4 text-sm font-medium text-card-foreground">No replies found</p>
        <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply, index) => {
        const key = reply.commentId || `reply-${index}`;
        const isSelected = reply.commentId ? selectedIds.has(reply.commentId) : false;

        return (
          <ReplyCard
            key={key}
            reply={reply}
            isSelected={isSelected}
            onSelectionChange={onSelectionChange}
            onApprove={onApprove}
            onIgnore={onIgnore}
            isActionPending={isActionPending}
          />
        );
      })}

      {/* Infinite scroll sentinel */}
      {hasNextPage && <div ref={sentinelRef} className="h-4" />}

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-xs text-muted-foreground">Loading more...</span>
        </div>
      )}

      {/* End of list */}
      {!hasNextPage && replies.length > 0 && (
        <div className="py-4 text-center">
          <p className="text-xs text-muted-foreground">You have reached the end of the list</p>
        </div>
      )}
    </div>
  );
}

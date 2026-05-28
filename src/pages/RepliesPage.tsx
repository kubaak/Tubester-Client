import { useCallback, useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { usePostApiRepliesApprove, usePostApiRepliesBatchIgnore } from '../api/replies/replies';
import type { BatchDecisionRequest, DraftDecisionDto } from '../api';
import { useRadixConfirmDialog } from '../components/dialogs/useRadixConfirmDialog';

import { Button } from '../components/ui/button';
import { RepliesContent } from '../features/replies/components/RepliesContent';
import { RepliesFilterSection } from '../features/replies/components/RepliesFilterSection';
import { RepliesSelectionBar } from '../features/replies/components/RepliesSelectionBar';
import { useRepliesSearch } from '../features/replies/hooks/useRepliesSearch';
import type { RepliesFilters } from '../features/replies/hooks/useRepliesSearch';
import { getGetApiCreditsBalanceQueryKey } from '@/api/credits/credits';
import { useQueryClient } from '@tanstack/react-query';

const EMPTY_FILTERS: RepliesFilters = {};

export default function RepliesPage() {
  const queryClient = useQueryClient();
  const { replies, nextPageToken, isInitialLoading, isFetchingNextPage, error, fetchInitial, fetchNextPage } =
    useRepliesSearch();

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirmation dialog
  const { confirm, confirmDialog } = useRadixConfirmDialog();

  // Filter state - distinct draft vs applied filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState<RepliesFilters>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<RepliesFilters>(EMPTY_FILTERS);

  // Mutations
  const approveMutation = usePostApiRepliesApprove();
  const batchIgnoreMutation = usePostApiRepliesBatchIgnore();

  const hasNextPage = nextPageToken !== null;
  const isApproving = approveMutation.isPending;
  const isIgnoring = batchIgnoreMutation.isPending;
  const isActionPending = isApproving || isIgnoring;

  const allVisibleSelected =
    replies.length > 0 && replies.every((reply) => reply.commentId && selectedIds.has(reply.commentId));

  // Load initial data on mount
  useEffect(() => {
    void fetchInitial(EMPTY_FILTERS);
    // mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter apply
  const handleApplyFilters = useCallback(async () => {
    const nextAppliedFilters = draftFilters;
    setAppliedFilters(nextAppliedFilters);
    setSelectedIds(new Set());
    await fetchInitial(nextAppliedFilters);
    setIsFilterOpen(false);
  }, [draftFilters, fetchInitial]);

  // Handle filter reset
  const handleResetFilters = useCallback(async () => {
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setSelectedIds(new Set());
    await fetchInitial(EMPTY_FILTERS);
  }, [fetchInitial]);

  // Handle load more for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      void fetchNextPage();
    }
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  // Toggle filter visibility
  const toggleFilter = useCallback(() => {
    setIsFilterOpen((prev) => !prev);
  }, []);

  // Handle selection change
  const handleSelectionChange = useCallback((commentId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (selected) {
        next.add(commentId);
      } else {
        next.delete(commentId);
      }
      return next;
    });
  }, []);

  // Handle select all (select all currently rendered replies)
  const handleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const visibleIds = replies
        .map((reply) => reply.commentId)
        .filter((commentId): commentId is string => Boolean(commentId));

      if (visibleIds.length === 0) {
        return prev;
      }

      const allVisibleSelected = visibleIds.every((commentId) => prev.has(commentId));
      const next = new Set(prev);

      if (allVisibleSelected) {
        visibleIds.forEach((commentId) => {
          next.delete(commentId);
        });
      } else {
        visibleIds.forEach((commentId) => {
          next.add(commentId);
        });
      }

      return next;
    });
  }, [replies]);

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Handle single approve with confirmation
  const handleApprove = useCallback(
    async (commentId: string) => {
      if (isActionPending) {
        return;
      }

      const reply = replies.find((r) => r.commentId === commentId);
      if (!reply?.suggestedText) {
        return;
      }

      const ok = await confirm('Do you really want to approve this reply?', reply.suggestedText);
      if (!ok) {
        return;
      }

      const decisions: DraftDecisionDto[] = [
        {
          commentId,
          approvedText: reply.suggestedText,
        },
      ];

      const request: BatchDecisionRequest = { decisions };

      try {
        await approveMutation.mutateAsync({ data: request });
        await queryClient.invalidateQueries({
          queryKey: getGetApiCreditsBalanceQueryKey(),
        });

        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });

        await fetchInitial(appliedFilters);
      } catch {
        // Error is intentionally left to mutation consumers / future toast handling.
      }
    },
    [appliedFilters, approveMutation, confirm, fetchInitial, isActionPending, replies],
  );

  // Handle single ignore with confirmation
  const handleIgnore = useCallback(
    async (commentId: string) => {
      if (isActionPending) {
        return;
      }

      const reply = replies.find((r) => r.commentId === commentId);
      const ok = await confirm('Do you really want to ignore this reply?', reply?.suggestedText);
      if (!ok) {
        return;
      }

      try {
        await batchIgnoreMutation.mutateAsync({ data: [commentId] });

        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });

        await fetchInitial(appliedFilters);
      } catch {
        // Error is intentionally left to mutation consumers / future toast handling.
      }
    },
    [appliedFilters, batchIgnoreMutation, confirm, fetchInitial, isActionPending, replies],
  );

  // Handle batch approve with confirmation
  const handleBatchApprove = useCallback(async () => {
    if (isActionPending || selectedIds.size === 0) {
      return;
    }

    const count = selectedIds.size;
    const ok = await confirm(`Do you really want to approve ${count} ${count === 1 ? 'reply' : 'replies'}?`);
    if (!ok) {
      return;
    }

    const decisions: DraftDecisionDto[] = Array.from(selectedIds)
      .map((commentId) => {
        const reply = replies.find((r) => r.commentId === commentId);
        if (!reply?.suggestedText) {
          return null;
        }

        return {
          commentId,
          approvedText: reply.suggestedText,
        };
      })
      .filter((decision): decision is DraftDecisionDto => decision !== null);

    if (decisions.length === 0) {
      return;
    }

    const request: BatchDecisionRequest = { decisions };

    try {
      await approveMutation.mutateAsync({ data: request });
      await queryClient.invalidateQueries({
        queryKey: getGetApiCreditsBalanceQueryKey(),
      });
      setSelectedIds(new Set());
      await fetchInitial(appliedFilters);
    } catch {
      // Error is intentionally left to mutation consumers / future toast handling.
    }
  }, [appliedFilters, approveMutation, confirm, fetchInitial, isActionPending, replies, selectedIds]);

  // Handle batch ignore with confirmation
  const handleBatchIgnore = useCallback(async () => {
    if (isActionPending || selectedIds.size === 0) {
      return;
    }

    const count = selectedIds.size;
    const ok = await confirm(`Do you really want to ignore ${count} ${count === 1 ? 'reply' : 'replies'}?`);
    if (!ok) {
      return;
    }

    const ids = Array.from(selectedIds);

    try {
      await batchIgnoreMutation.mutateAsync({ data: ids });
      setSelectedIds(new Set());
      await fetchInitial(appliedFilters);
    } catch {
      // Error is intentionally left to mutation consumers / future toast handling.
    }
  }, [appliedFilters, batchIgnoreMutation, confirm, fetchInitial, isActionPending, selectedIds]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Suggested Replies</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Browse and manage AI-generated reply suggestions for your comments
          </p>
        </div>

        <Button variant="outline" onClick={toggleFilter} className="shrink-0">
          <Filter className="h-4 w-4" />
          {isFilterOpen ? 'Hide Filters' : 'Filter'}
        </Button>
      </div>

      {/* Filter Section - hidden by default */}
      {isFilterOpen && (
        <RepliesFilterSection
          draftFilters={draftFilters}
          onDraftFiltersChange={setDraftFilters}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-5 py-4">
          <p className="text-sm text-destructive">Failed to load replies. Please try again.</p>
          <Button
            variant="ghost"
            size="sm"
            disabled={isInitialLoading}
            onClick={() => {
              setSelectedIds(new Set());
              void fetchInitial(appliedFilters);
            }}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Selection Bar */}
      {replies.length > 0 && (
        <RepliesSelectionBar
          selectedCount={selectedIds.size}
          allSelected={allVisibleSelected}
          onToggleSelectAll={handleSelectAll}
          onClearSelection={handleClearSelection}
          onBatchIgnore={handleBatchIgnore}
          onBatchApprove={handleBatchApprove}
          isActionPending={isActionPending}
        />
      )}

      {/* Content Area */}
      <RepliesContent
        replies={replies}
        isInitialLoading={isInitialLoading && replies.length === 0}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onLoadMore={handleLoadMore}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onApprove={handleApprove}
        onIgnore={handleIgnore}
        isActionPending={isActionPending}
      />

      {/* Confirmation Dialog */}
      {confirmDialog}
    </div>
  );
}

import { useMemo } from 'react';

import { useGetApiCreditsBalance, useGetApiCreditsCosts } from '@/api/credits/credits';

import type { AiVideoTemplateRequest, CreditActionCosts } from '@/api';

export type AiOperationSelection = Pick<
  AiVideoTemplateRequest,
  'generateTitle' | 'generateDescription' | 'generateTags' | 'suggestPlaylists'
>;

export type AiCreditCostResult = {
  totalCost: number | null;
  balance: number | null;
  insufficientBalance: boolean;
  isLoading: boolean;
  isError: boolean;
  isReady: boolean;
  errorMessage: string | null;
};

function calculateCreditCost(selection: AiOperationSelection, costs: CreditActionCosts): number {
  return (
    (selection.generateTitle ? costs.aiTitle : 0) +
    (selection.generateDescription ? costs.aiDescription : 0) +
    (selection.generateTags ? costs.aiTags : 0) +
    (selection.suggestPlaylists ? costs.aiPlaylist : 0)
  );
}

/**
 * Hook to manage AI credit costs and balance.
 *
 * Important:
 * - Does not use frontend fallback/default costs.
 * - If costs or balance cannot be loaded, AI submit should be blocked.
 */
export function useAiCreditCost(selection: AiOperationSelection): AiCreditCostResult {
  const balanceQuery = useGetApiCreditsBalance();
  const costsQuery = useGetApiCreditsCosts();

  const costs = costsQuery.data?.data;
  const balance = balanceQuery.data?.data?.balance;

  const { generateTitle, generateDescription, generateTags, suggestPlaylists } = selection;

  const totalCost = useMemo(() => {
    if (costs == null) {
      return null;
    }

    return calculateCreditCost(
      {
        generateTitle,
        generateDescription,
        generateTags,
        suggestPlaylists,
      },
      costs,
    );
  }, [costs, generateTitle, generateDescription, generateTags, suggestPlaylists]);

  const isLoading = costsQuery.isLoading || balanceQuery.isLoading;

  const isMissingCosts = costsQuery.isSuccess && costs == null;
  const isMissingBalance = balanceQuery.isSuccess && balance == null;

  const errorMessage =
    costsQuery.isError
      ? 'Credit costs could not be loaded. Please refresh the page and try again.'
      : balanceQuery.isError
        ? 'Credit balance could not be loaded. Please refresh the page and try again.'
        : isMissingCosts
          ? 'Credit costs are unavailable. Please refresh the page and try again.'
          : isMissingBalance
            ? 'Credit balance is unavailable. Please refresh the page and try again.'
            : null;

  const isError = errorMessage !== null;

  const isReady =
    !isLoading &&
    !isError &&
    costs != null &&
    totalCost !== null &&
    balance != null;

  const insufficientBalance = isReady && balance < totalCost;

  return {
    totalCost,
    balance: balance ?? null,
    insufficientBalance,
    isLoading,
    isError,
    isReady,
    errorMessage,
  };
}
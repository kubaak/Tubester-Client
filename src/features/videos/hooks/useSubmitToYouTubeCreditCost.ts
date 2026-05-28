import { useGetApiCreditsBalance, useGetApiCreditsCosts } from '@/api/credits/credits';

export type SubmitToYouTubeCreditCostResult = {
  totalCost: number | null;
  balance: number | null;
  insufficientBalance: boolean;
  isLoading: boolean;
  isError: boolean;
  isReady: boolean;
  errorMessage: string | null;
};

/**
 * Hook to manage submit to YouTube credit cost and balance.
 *
 * Important:
 * - Does not use frontend fallback/default costs.
 * - If costs or balance cannot be loaded, submit should be blocked.
 */
export function useSubmitToYouTubeCreditCost(): SubmitToYouTubeCreditCostResult {
  const balanceQuery = useGetApiCreditsBalance();
  const costsQuery = useGetApiCreditsCosts();

  const costs = costsQuery.data?.data;
  const balance = balanceQuery.data?.data?.balance;

  const totalCost = costs?.videoDetailsSubmitted ?? null;

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
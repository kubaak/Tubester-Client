import { useGetApiCreditsBalance, useGetApiCreditsCosts } from '@/api/credits/credits';

export function useReplyApproveCreditCost(replyCount = 1) {
  const balanceQuery = useGetApiCreditsBalance();
  const costsQuery = useGetApiCreditsCosts();

  const balance = balanceQuery.data?.data.balance ?? null;
  const unitCost = costsQuery.data?.data.replyPostedToYouTube ?? null;

  const totalCost = unitCost === null ? null : unitCost * replyCount;

  const isLoading = balanceQuery.isLoading || costsQuery.isLoading;
  const isError = balanceQuery.isError || costsQuery.isError;

  const isReady =
    !isLoading &&
    !isError &&
    balance !== null &&
    totalCost !== null;

  const insufficientBalance = isReady && balance < totalCost;

  return {
    unitCost,
    totalCost,
    balance,
    isLoading,
    isError,
    isReady,
    insufficientBalance,
  };
}
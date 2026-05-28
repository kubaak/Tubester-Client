import { Coins } from 'lucide-react';
import { useGetApiCreditsBalance } from '@/api/credits/credits';

export function CreditBalanceBadge() {
  const { data, isLoading } = useGetApiCreditsBalance();

  const balance = data?.data.balance;

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3 py-2 text-sm shadow-sm">
      <Coins className="h-4 w-4 text-muted-foreground" />
      <span className="font-semibold">{isLoading ? '...' : (balance ?? 0)}</span>
    </div>
  );
}

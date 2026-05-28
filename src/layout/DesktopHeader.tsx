import { CreditBalanceBadge } from '@/features/credits/components/CreditBalanceBadge';
import { UserMenu } from './UserMenu';

type DesktopHeaderProps = {
  isUserMenuOpen: boolean;
  onOpenUserMenu: () => void;
  onCloseUserMenu: () => void;
  onLogout: () => void;
  currentPageTitle: string;
  user: { name?: string; email?: string; picture?: string } | null;
};

export function DesktopHeader({
  isUserMenuOpen,
  onOpenUserMenu,
  onCloseUserMenu,
  onLogout,
  currentPageTitle,
  user,
}: DesktopHeaderProps) {
  return (
    <header className="glass relative z-40 hidden border-b border-border/50 px-6 py-4 lg:block">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <h2 className="truncate text-2xl font-semibold tracking-tight text-foreground">{currentPageTitle}</h2>

          <div className="hidden rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">
            Beta
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CreditBalanceBadge />

          <UserMenu
            user={user}
            isOpen={isUserMenuOpen}
            onOpen={onOpenUserMenu}
            onClose={onCloseUserMenu}
            onLogout={onLogout}
            variant="desktop"
          />
        </div>
      </div>
    </header>
  );
}

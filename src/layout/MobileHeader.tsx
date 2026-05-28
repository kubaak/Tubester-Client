import { Menu, X } from 'lucide-react';

import { CreditBalanceBadge } from '@/features/credits/components/CreditBalanceBadge';
import { UserMenu } from './UserMenu';
import { MobileNavigationMenu } from './MobileNavigationMenu';

type IconType = import('react').ComponentType<{ className?: string }>;

type NavigationItem = {
  readonly path: string;
  readonly label: string;
  readonly icon: IconType;
};

type MobileHeaderProps = {
  isNavOpen: boolean;
  isUserMenuOpen: boolean;
  onToggleNav: () => void;
  onOpenUserMenu: () => void;
  onCloseUserMenu: () => void;
  onLogout: () => void;
  primaryNav: readonly NavigationItem[];
  secondaryNav: readonly NavigationItem[];
  currentPath: string;
  currentPageTitle: string;
  user: { name?: string; email?: string; picture?: string } | null;
  onCloseAll: () => void;
};

export function MobileHeader({
  isNavOpen,
  isUserMenuOpen,
  onToggleNav,
  onOpenUserMenu,
  onCloseUserMenu,
  onLogout,
  primaryNav,
  secondaryNav,
  currentPath,
  currentPageTitle,
  user,
  onCloseAll,
}: MobileHeaderProps) {
  return (
    <header className="glass relative z-[60] border-b border-border/50 lg:hidden">
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggleNav}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-background/70 text-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={isNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isNavOpen}
          aria-controls="mobile-navigation"
        >
          {isNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <div className="flex min-w-0 items-center justify-center gap-3">
          <img src="/tubester_logo.png" alt="Tubester logo" className="h-8 w-auto shrink-0 object-contain" />

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">{currentPageTitle}</div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <CreditBalanceBadge />

          <UserMenu
            user={user}
            isOpen={isUserMenuOpen}
            onOpen={onOpenUserMenu}
            onClose={onCloseUserMenu}
            onLogout={onLogout}
            variant="mobile"
          />
        </div>
      </div>

      {isNavOpen && (
        <MobileNavigationMenu
          primaryNav={primaryNav}
          secondaryNav={secondaryNav}
          currentPath={currentPath}
          onClose={onCloseAll}
        />
      )}
    </header>
  );
}

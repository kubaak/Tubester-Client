import { useLocation } from 'react-router-dom';
import { useState, type ReactNode } from 'react';
import { Video, MessageCircle, Home, HelpCircle, Info, Mail, Settings } from 'lucide-react';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileHeader } from './MobileHeader';
import { DesktopHeader } from './DesktopHeader';
import { useAuth } from '@/contexts/useAuth';
import { PendingWriteActionBootstrap } from '@/auth/PendingWriteActionBootstrap';

type IconType = import('react').ComponentType<{ className?: string }>;

interface NavigationItem {
  readonly path: string;
  readonly label: string;
  readonly icon: IconType;
}

const primaryNav: readonly NavigationItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/improve', label: 'Improve', icon: Video },
  { path: '/replies', label: 'Replies', icon: MessageCircle },
  { path: '/copy', label: 'Copy', icon: Video },
] as const;

const baseSecondaryNav: readonly NavigationItem[] = [
  { path: '/settings/account', label: 'Account', icon: Settings },
  { path: '/settings/channel', label: 'Channel', icon: Settings },
  { path: '/help', label: 'Help', icon: HelpCircle },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Mail },
] as const;

function getSecondaryNav(isAdmin: boolean): readonly NavigationItem[] {
  return isAdmin
    ? [...baseSecondaryNav, { path: '/settings/configuration', label: 'Configuration', icon: Settings }]
    : baseSecondaryNav;
}

interface LayoutProps {
  children: ReactNode;
}

function getCurrentPageTitle(
  pathname: string,
  primaryItems: readonly NavigationItem[],
  secondaryItems: readonly NavigationItem[],
): string {
  return (
    primaryItems.find((item) => item.path === pathname)?.label ||
    secondaryItems.find((item) => item.path === pathname)?.label ||
    (pathname === '/faq' ? 'FAQ' : null) ||
    (pathname === '/privacy' ? 'Privacy Policy' : null) ||
    (pathname === '/terms' ? 'Terms of Service' : null) ||
    (pathname === '/settings/account' ? 'Account Settings' : null) ||
    (pathname === '/settings/channel' ? 'Channel Settings' : null) ||
    (pathname === '/settings/configuration' ? 'Configuration' : null) ||
    'Tubester'
  );
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useState(false);
  const [isDesktopUserMenuOpen, setIsDesktopUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const secondaryNav = getSecondaryNav(!!user?.isAdmin);
  const currentPageTitle = getCurrentPageTitle(location.pathname, primaryNav, secondaryNav);

  const closeMobileSurfaces = (): void => {
    setIsMobileUserMenuOpen(false);
    setIsMobileNavOpen(false);
  };

  const handleLogout = (): void => {
    logout();
    setIsMobileUserMenuOpen(false);
    setIsDesktopUserMenuOpen(false);
    setIsMobileNavOpen(false);
  };

  const toggleMobileNav = (): void => {
    setIsMobileUserMenuOpen(false);
    setIsMobileNavOpen((open) => !open);
  };

  const openMobileUserMenu = (): void => {
    setIsMobileNavOpen(false);
    setIsMobileUserMenuOpen(true);
  };

  const closeMobileUserMenu = (): void => {
    setIsMobileUserMenuOpen(false);
  };

  const openDesktopUserMenu = (): void => {
    setIsDesktopUserMenuOpen(true);
  };

  const closeDesktopUserMenu = (): void => {
    setIsDesktopUserMenuOpen(false);
  };

  const toggleCollapse = (): void => {
    setCollapsed((value) => !value);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-surface text-foreground lg:flex-row">
      <PendingWriteActionBootstrap />

      <DesktopSidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        primaryNav={primaryNav}
        secondaryNav={secondaryNav}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <MobileHeader
          isNavOpen={isMobileNavOpen}
          isUserMenuOpen={isMobileUserMenuOpen}
          onToggleNav={toggleMobileNav}
          onOpenUserMenu={openMobileUserMenu}
          onCloseUserMenu={closeMobileUserMenu}
          onLogout={handleLogout}
          primaryNav={primaryNav}
          secondaryNav={secondaryNav}
          currentPath={location.pathname}
          currentPageTitle={currentPageTitle}
          user={user}
          onCloseAll={closeMobileSurfaces}
        />

        <DesktopHeader
          isUserMenuOpen={isDesktopUserMenuOpen}
          onOpenUserMenu={openDesktopUserMenu}
          onCloseUserMenu={closeDesktopUserMenu}
          onLogout={handleLogout}
          currentPageTitle={currentPageTitle}
          user={user}
        />

        <main className="z-0 flex-1 overflow-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

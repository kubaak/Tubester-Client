import { type ReactNode } from 'react';
import { useAuth } from '../contexts/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import { YouTubeConnectionRequiredCard } from '@/components/YouTubeConnectionRequiredCard';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="glass rounded-2xl p-8 shadow-dramatic border border-border/50">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-lg font-medium text-foreground">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated at all
  if (!isAuthenticated || user === null) {
    const returnUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  // Authenticated but YouTube permission missing - show reconnect CTA
  if (!user.hasYouTubeReadAccess) {
    return <YouTubeConnectionRequiredCard variant="missing-permission" />;
  }

  // Authenticated but no channel found - show no channel message
  if (!user.hasChannel) {
    return <YouTubeConnectionRequiredCard variant="no-channel" />;
  }

  // Render protected content when user has full YouTube access with channel
  return <>{children}</>;
};

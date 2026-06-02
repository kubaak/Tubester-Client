import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService, type User } from '../services/auth';
import { usePostApiChannelsPull, usePostApiChannelsSyncCurrent } from '../api/channels/channels';
import { getGetApiChannelSettingsQueryOptions } from '@/api/channel-settings/channel-settings';
import { resetWriteAccessCache } from '@/auth/writeAccess';
import { clearPendingWriteAction } from '@/auth/pendingWriteAction';
import { AuthContext, type AuthContextType } from './useAuth';
import { hasFullYouTubeAccess } from './hasFullYouTubeAccess';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSyncedCurrentChannel = useRef(false);
  const hasPrefetchedChannelSettings = useRef(false);
  const hasPulledComments = useRef(false);
  const queryClient = useQueryClient();

  const refreshUser = async (): Promise<void> => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  const login = (returnUrl?: string): void => {
    authService.initiateGoogleLogin(returnUrl);
  };

  const logout = (): void => {
    resetWriteAccessCache();
    clearPendingWriteAction();

    hasSyncedCurrentChannel.current = false;
    hasPrefetchedChannelSettings.current = false;
    hasPulledComments.current = false;

    queryClient.clear();
    setUser(null);

    authService.logout();
  };

  const postApiChannelsPullMutation = usePostApiChannelsPull();
  const postApiChannelsSyncCurrentMutation = usePostApiChannelsSyncCurrent();

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      setIsLoading(true);

      try {
        await refreshUser();
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, []);

  useEffect(() => {
    // Only sync for users with full YouTube access
    if (user === null || !hasFullYouTubeAccess(user) || hasSyncedCurrentChannel.current) {
      return;
    }

    hasSyncedCurrentChannel.current = true;

    const syncChannelsAndPrefetch = async (): Promise<void> => {
      try {
        // Step 1: Pull channels first
        await postApiChannelsPullMutation.mutateAsync();

        // Step 2: After successful channels pull, sync current channel
        postApiChannelsSyncCurrentMutation.mutate();

        // Step 3: Prefetch channel settings
        if (!hasPrefetchedChannelSettings.current) {
          hasPrefetchedChannelSettings.current = true;
          await queryClient.fetchQuery(getGetApiChannelSettingsQueryOptions({ axios: { skipAuthRedirect: true } }));
        }
      } catch {
        // Silently fail - channels pull or prefetch may fail
      }
    };

    void syncChannelsAndPrefetch();
  }, [user, queryClient, postApiChannelsPullMutation, postApiChannelsSyncCurrentMutation]);

  const isAuthenticated = user !== null && user.isAuthenticated;

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

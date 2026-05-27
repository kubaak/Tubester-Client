import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService, type User } from '../services/auth';
import { usePostApiChannelsSyncCurrent } from '../api/channels/channels';
import { getGetApiChannelSettingsQueryOptions } from '@/api/channel-settings/channel-settings';
import { getGetApiComentsPullQueryOptions } from '@/api/comments/comments';
import { resetWriteAccessCache } from '@/auth/writeAccess';
import { clearPendingWriteAction } from '@/auth/pendingWriteAction';
import { AuthContext, type AuthContextType } from './useAuth';

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

    queryClient.clear();
    setUser(null);

    window.location.assign('/api/auth/logout');
  };

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
    if (user === null || !user.isAuthenticated || hasSyncedCurrentChannel.current) {
      return;
    }

    hasSyncedCurrentChannel.current = true;
    postApiChannelsSyncCurrentMutation.mutate();
  }, [user, postApiChannelsSyncCurrentMutation]);

  useEffect(() => {
    if (user === null || !user.isAuthenticated || hasPrefetchedChannelSettings.current) {
      return;
    }

    hasPrefetchedChannelSettings.current = true;

    const prefetchChannelSettings = async (): Promise<void> => {
      try {
        const response = await queryClient.fetchQuery(getGetApiChannelSettingsQueryOptions());

        if (response?.data?.isCommentAssistantEnabled && !hasPulledComments.current) {
          await queryClient.prefetchQuery(getGetApiComentsPullQueryOptions());
          hasPulledComments.current = true;
        }
      } catch {
        // Silently fail - channel settings may not exist yet
      }
    };

    void prefetchChannelSettings();
  }, [user, queryClient]);

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

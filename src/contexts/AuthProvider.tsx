import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authService, type User } from '../services/auth';
import { usePostApiChannelsSyncCurrent } from '../api/channels/channels';
import { resetWriteAccessCache } from '@/auth/writeAccess';
import { clearPendingWriteAction } from '@/auth/pendingWriteAction';
import { AuthContext, type AuthContextType } from './useAuth';
import { hasYouTubeAccess } from './hasYouTubeAccess';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasSyncedCurrentChannel = useRef(false);
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

    queryClient.clear();
    setUser(null);

    authService.logout();
  };

  const postApiChannelsSyncCurrentMutation = usePostApiChannelsSyncCurrent();

  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      setIsLoading(true);

      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };

    void initializeAuth();
  }, []);

  useEffect(() => {
    // Only sync for users with full YouTube access
    if (user === null || !hasYouTubeAccess(user) || hasSyncedCurrentChannel.current) {
      return;
    }

    hasSyncedCurrentChannel.current = true;
    postApiChannelsSyncCurrentMutation.mutate();
  }, [user, postApiChannelsSyncCurrentMutation]);

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

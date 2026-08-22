import type { User } from '@/services/auth';

/**
 * Helper to check if user has full YouTube access with a connected channel.
 * Used to determine whether to run background prefetches and channel operations.
 */
export function hasYouTubeAccess(user: User | null): boolean {
  return user !== null && user.isAuthenticated && user.hasYouTubeReadAccess && user.hasChannel;
}
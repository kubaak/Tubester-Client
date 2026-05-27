import axios from 'axios';

export interface User {
  email: string;
  name: string;
  picture?: string;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const authService = {
  initiateGoogleLogin(returnUrl?: string): void {
    const authenticationSearchParameters = new URLSearchParams();

    if (returnUrl) {
      authenticationSearchParameters.append('returnUrl', returnUrl);
    }

    const queryString = authenticationSearchParameters.toString();
    const authenticationUrlPath = `/api/auth/login/google${queryString ? `?${queryString}` : ''}`;

    window.location.href = authenticationUrlPath;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get<User>('/api/auth/me', {
        skipAuthRedirect: true,
      });

      return {
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture,
        isAuthenticated: true,
        isAdmin: response.data.isAdmin ?? false,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return null;
      }

      console.error('Failed to load current user:', error);
      return null;
    }
  },

  logout(): void {
    window.location.assign('/api/auth/logout');
  },
};
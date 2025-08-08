'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { AuthContextType, AuthState, LoginForm, RegisterForm } from '@/types';
import authApi from '@/app/api/auth';
import { setTokenHelpers } from '@/app/api/axios-client';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    accessToken: null,
  });

  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);

  // Cookie management functions
  const setAccessTokenCookie = useCallback((token: string) => {
    // Set access token cookie for middleware to read
    document.cookie = `accessToken=${token}; path=/; max-age=${15 * 60}; SameSite=Strict; Secure=${process.env.NODE_ENV === 'production'}`;
  }, []);

  const removeAccessTokenCookie = useCallback(() => {
    // Remove access token cookie
    document.cookie =
      'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict';
  }, []);

  // Decode JWT token to get expiration time
  const decodeToken = useCallback((token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }, []);

  // Calculate time until token expires (in milliseconds)
  const getTimeUntilExpiry = useCallback(
    (token: string) => {
      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) return 0;

      const expiryTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;

      // Refresh 2 minutes before expiry
      return Math.max(0, timeUntilExpiry - 2 * 60 * 1000);
    },
    [decodeToken]
  );

  // Schedule automatic token refresh
  const scheduleTokenRefresh = useCallback(
    (token: string) => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      const timeUntilRefresh = getTimeUntilExpiry(token);

      if (timeUntilRefresh > 0) {
        refreshTimeoutRef.current = setTimeout(async () => {
          if (!isRefreshingRef.current) {
            await refreshToken();
          }
        }, timeUntilRefresh);
      }
    },
    [getTimeUntilExpiry]
  );

  // Refresh access token
  const refreshToken = useCallback(async () => {
    if (isRefreshingRef.current) return;

    try {
      isRefreshingRef.current = true;
      const response = await authApi.refresh();

      if (response.success && response.data.accessToken) {
        const newToken = response.data.accessToken;

        setAuthState((prev) => ({
          ...prev,
          accessToken: newToken,
          isAuthenticated: true,
          user: response.data.user || prev.user,
        }));

        // Set access token cookie for middleware
        setAccessTokenCookie(newToken);

        // Schedule next refresh
        scheduleTokenRefresh(newToken);
      } else {
        // Refresh failed, logout user silently
        removeAccessTokenCookie();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          accessToken: null,
        });
      }
    } catch (error: unknown) {
      // Only log errors that aren't 401 (which is expected when no refresh token exists)
      const axiosError = error as { response?: { status?: number } };
      if (axiosError?.response?.status !== 401) {
        console.error('Token refresh failed:', error);
      }

      // Set unauthenticated state silently
      removeAccessTokenCookie();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
      });
    } finally {
      isRefreshingRef.current = false;
    }
  }, [scheduleTokenRefresh]);

  // Set up token helpers for axios client
  React.useEffect(() => {
    setTokenHelpers(() => authState.accessToken, refreshToken);
  }, [authState.accessToken, refreshToken]);

  // Login function
  const login = useCallback(
    async (credentials: LoginForm) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await authApi.login(credentials);

        if (response.success && response.data.accessToken) {
          const token = response.data.accessToken;

          setAuthState({
            user: response.data.user || null,
            isAuthenticated: true,
            isLoading: false,
            accessToken: token,
          });

          // Set access token cookie for middleware
          setAccessTokenCookie(token);

          // Schedule automatic refresh
          scheduleTokenRefresh(token);
        } else {
          throw new Error(response.message || 'Login failed');
        }
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [scheduleTokenRefresh]
  );

  // Register function
  const register = useCallback(
    async (userData: RegisterForm) => {
      try {
        setAuthState((prev) => ({ ...prev, isLoading: true }));

        const response = await authApi.register(userData);

        if (response.success && response.data.accessToken) {
          const token = response.data.accessToken;

          setAuthState({
            user: response.data.user || null,
            isAuthenticated: true,
            isLoading: false,
            accessToken: token,
          });

          // Set access token cookie for middleware
          setAccessTokenCookie(token);

          // Schedule automatic refresh
          scheduleTokenRefresh(token);
        } else {
          throw new Error(response.message || 'Registration failed');
        }
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [scheduleTokenRefresh]
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Clear refresh timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null;
      }

      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state regardless of API call result
      removeAccessTokenCookie();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        accessToken: null,
      });
      isRefreshingRef.current = false;

      // Redirect to authenticate page
      router.push('/authenticate');
    }
  }, [router, removeAccessTokenCookie]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Only try to refresh if we might have a valid refresh token
        // This prevents unnecessary 401 errors on initial load
        const response = await authApi.refresh();

        if (response.success && response.data.accessToken) {
          const newToken = response.data.accessToken;

          setAuthState({
            user: response.data.user || null,
            isAuthenticated: true,
            isLoading: false,
            accessToken: newToken,
          });

          // Set access token cookie for middleware
          setAccessTokenCookie(newToken);

          // Schedule next refresh
          scheduleTokenRefresh(newToken);
        } else {
          // No valid refresh token, user is not authenticated
          removeAccessTokenCookie();
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        // If refresh fails (401, network error, etc.), user is not authenticated
        // Don't log this as an error since it's expected when no refresh token exists
        removeAccessTokenCookie();
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    checkAuthStatus();

    // Cleanup timeout on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [scheduleTokenRefresh, setAccessTokenCookie, removeAccessTokenCookie]);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

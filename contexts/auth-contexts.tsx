'use client';

import authApi from '@/app/api/auth';
import { useAutoRefreshToken } from '@/hooks/useAutoRefreshToken';
import { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  accessToken: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useAutoRefreshToken(accessToken, setAccessToken);

  useEffect(() => {
    authApi
      .refresh()
      .then((res) => setAccessToken(res.data.accessToken))
      .catch(() => setAccessToken(null));
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

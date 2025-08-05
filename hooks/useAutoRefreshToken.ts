import { useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import authApi from '@/app/api/auth';

type TokenPayload = {
  exp: number;
};

const REFRESH_BEFORE = 2 * 60 * 1000;

export const useAutoRefreshToken = (
  accessToken: string | null,
  setAccessToken: (token: string | null) => void
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    let decoded: TokenPayload;
    try {
      decoded = jwtDecode(accessToken);
    } catch (error) {
      console.log(error);
      return;
    }

    const expTime = decoded.exp * 1000;
    const now = Date.now();
    const timeUntilRefresh = expTime - now - REFRESH_BEFORE;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (timeUntilRefresh > 0) {
      timeoutRef.current = setTimeout(() => {
        authApi
          .refresh()
          .then((res) => {
            setAccessToken(res.data.accessToken);
          })
          .catch((err) => {
            console.error('Auto refresh failed', err);
            setAccessToken(null);
          });
        console.log('refresh');
      }, timeUntilRefresh);
    } else {
      authApi
        .refresh()
        .then((res) => {
          setAccessToken(res.data.accessToken);
        })
        .catch((err) => {
          console.error('Auto refresh failed', err);
          setAccessToken(null);
        });
    }
  });
};

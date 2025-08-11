import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';

// Store token getter function to avoid circular dependency
let getAccessToken: (() => string | null) | null = null;
let refreshTokenFn: (() => Promise<void>) | null = null;

// Function to set token getter (called from auth context)
export const setTokenHelpers = (
  tokenGetter: () => string | null,
  tokenRefresher: () => Promise<void>
) => {
  getAccessToken = tokenGetter;
  refreshTokenFn = tokenRefresher;
};

const baseAxiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || 'http://localhost:8000/api',
  withCredentials: true,
});

// Track if we're currently refreshing to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Add a request interceptor
baseAxiosClient.interceptors.request.use(
  function (config) {
    // Add access token to requests if available
    if (getAccessToken) {
      const token = getAccessToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
baseAxiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response.data;
  },
  async function (error: AxiosError) {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is 401 and we have a refresh function and an access token, try to refresh token
    // Don't attempt refresh if there's no current token (user not logged in)
    if (
      error.response?.status === 401 &&
      refreshTokenFn &&
      originalRequest &&
      !originalRequest._retry &&
      getAccessToken &&
      getAccessToken() // Only attempt refresh if we have a current token
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Retry original request with new token
            if (getAccessToken) {
              const token = getAccessToken();
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
            }
            return baseAxiosClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshTokenFn();
        processQueue(null);

        // Retry original request with new token
        if (getAccessToken) {
          const token = getAccessToken();
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
        }

        return baseAxiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(error, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Create a typed wrapper that returns the data directly
const axiosClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    baseAxiosClient.get(url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => baseAxiosClient.post(url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => baseAxiosClient.put(url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    baseAxiosClient.delete(url, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => baseAxiosClient.patch(url, data, config),
};

export default axiosClient;

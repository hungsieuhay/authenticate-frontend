import axios, { AxiosResponse } from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// Create a typed wrapper that reflects the interceptor behavior
interface TypedAxiosClient {
  get<T>(url: string, config?: unknown): Promise<T>;
  post<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  put<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  delete<T>(url: string, config?: unknown): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
}

const typedAxiosClient: TypedAxiosClient = axiosClient as TypedAxiosClient;

export default typedAxiosClient;

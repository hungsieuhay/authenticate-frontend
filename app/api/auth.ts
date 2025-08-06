import { LoginForm, RegisterForm } from '@/types';
import axiosClient from './axios-client';

type TokenPayload = {
  message: string;
  data: {
    accessToken: string;
  };
  success: boolean;
};

const authApi = {
  async register(values: RegisterForm): Promise<TokenPayload> {
    const data = await axiosClient.post<TokenPayload>('/auth/register', values);
    return data;
  },
  async login(values: LoginForm): Promise<TokenPayload> {
    const data = await axiosClient.post<TokenPayload>('/auth/login', values);
    return data;
  },
  async refresh(): Promise<TokenPayload> {
    const data = await axiosClient.post<TokenPayload>('/auth/refresh');
    return data;
  },
  async logout(): Promise<void> {
    const data = await axiosClient.post<void>('/auth/logout');
    return data;
  },
};

export default authApi;

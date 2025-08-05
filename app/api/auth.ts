import { LoginForm, RegisterForm } from '@/types';
import axiosClient from './axios-client';

const authApi = {
  async register(values: RegisterForm): Promise<RegisterForm> {
    const data = await axiosClient.post<RegisterForm>('/auth/register', values);
    return data;
  },
  async login(values: LoginForm): Promise<LoginForm> {
    const data = await axiosClient.post<LoginForm>('/auth/login', values);
    return data;
  },
};

export default authApi;

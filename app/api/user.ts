import { User } from '@/types';
import axiosClient from './axios-client';

type Response<T> = {
  message: string;
  data: T;
  success: boolean;
};

const userApi = {
  async userDetail(): Promise<Response<User>> {
    const data = await axiosClient.get<Response<User>>('/auth/profile');
    return data;
  },
};

export default userApi;

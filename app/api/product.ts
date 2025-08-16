import { ProductResponse } from '@/types';
import axiosClient from './axios-client';

type Response<T> = {
  message: string;
  data: T;
  success: boolean;
};

const productApi = {
  async productList(
    page: number = 1,
    limit: number = 12
  ): Promise<Response<ProductResponse>> {
    const res = await axiosClient.get<Response<ProductResponse>>(
      `/products?page=${page}&limit=${limit}`
    );
    return res;
  },
};

export default productApi;

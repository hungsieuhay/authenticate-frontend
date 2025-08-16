'use client';
import { ProductCard } from '@/components/product-card';
import { Meta, Product } from '@/types';
import { useEffect, useState } from 'react';
import productApi from '../api/product';

export const ProductList = () => {
  const [productList, setProductList] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(2);
  const itemsPerPage = 12;

  const fetchProductList = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await productApi.productList(page, itemsPerPage);
      const { data: products, meta: metaData } = response.data;
      setProductList(products);
      setMeta(metaData);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="container grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4 py-10">
        {Array.from({ length: 12 }, (_, index) => (
          <ProductCard.Skeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))] gap-4">
        {productList.map(({ imageUrl, name, desc, price, totalSell, id }) => (
          <ProductCard
            key={id}
            imageUrl={imageUrl}
            name={name}
            desc={desc}
            price={price}
            totalSell={totalSell}
          />
        ))}
      </div>
    </div>
  );
};

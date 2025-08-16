'use client';

import Image from 'next/image';
import { Skeleton } from './ui/skeleton';

interface ProductCardProps {
  imageUrl: string;
  name: string;
  desc: string;
  price: number;
  totalSell: number;
}

export const ProductCard = ({
  imageUrl,
  name,
  desc,
  price,
  totalSell,
}: ProductCardProps) => {
  return (
    <div className="relative min-h-[320px] cursor-pointer overflow-hidden rounded-md p-2">
      <Image
        src={imageUrl}
        alt="product-image"
        className="absolute inset-0 scale-100 bg-cover bg-center transition-all hover:scale-110"
        fill
      />
      <div className="glass-background absolute inset-x-2 bottom-2 flex flex-col gap-3 rounded-lg p-3 text-sm">
        <h3>{name}</h3>
        <p className="line-clamp-2">{desc}</p>
        <div className="flex items-center justify-between">
          <p>Price: ${price}</p>
          <p>Total sell: {totalSell}</p>
        </div>
      </div>
    </div>
  );
};

ProductCard.Skeleton = function ProductCardSkeleton() {
  return <Skeleton className="min-h-[320px] rounded-xl" />;
};

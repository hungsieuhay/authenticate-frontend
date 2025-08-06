'use client';

import { PropsWithChildren } from 'react';
import { Navigation } from './navigation';
import { usePathname } from 'next/navigation';

const MainLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/authenticate');
  return (
    <div className="flex flex-col">
      {!isAuthPage && <Navigation />}
      {children}
    </div>
  );
};

export default MainLayout;

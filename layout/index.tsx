import { PropsWithChildren } from 'react';
import { Navigation } from './navigation';

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col">
      <Navigation />
      {children}
    </div>
  );
};

export default MainLayout;

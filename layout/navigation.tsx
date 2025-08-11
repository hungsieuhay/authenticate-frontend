'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { UserAvatar } from '@/components/user-avatar';

export const Navigation = () => {
  return (
    <header className="sticky top-0 flex w-full justify-between p-4">
      <UserAvatar />
      <ThemeToggle />
    </header>
  );
};

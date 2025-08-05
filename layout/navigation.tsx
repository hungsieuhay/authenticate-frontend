'use client';

import userApi from '@/app/api/user';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User } from '@/types';
import { useEffect, useState } from 'react';

export const Navigation = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const data = await userApi.userDetail();
        setUserData(data.data);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };

    fetchUserData();
    setIsLoading(false);
  }, []);

  if (isLoading) return <div>Loading...</div>;

  const avatarName = userData?.firstName.substring(0, 1);

  return (
    <header className="sticky top-0 h-10 w-full">
      <Popover>
        <PopoverTrigger>
          <div className="flex h-10 w-10 rounded-full bg-black">
            <p className="mx-auto self-center text-2xl font-semibold text-white">
              {avatarName}
            </p>
          </div>
        </PopoverTrigger>
        <PopoverContent>Place content for the popover here.</PopoverContent>
      </Popover>
    </header>
  );
};

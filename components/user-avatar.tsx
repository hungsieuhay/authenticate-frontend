'use client';

import userApi from '@/app/api/user';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/auth-context';
import { User } from '@/types';
import { useEffect, useState } from 'react';

export const UserAvatar = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { logout } = useAuth();

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

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2">
          <div className="bg-foreground flex h-8 w-8 rounded-full">
            <p className="text-background mx-auto self-center font-mono text-xl uppercase">
              {avatarName}
            </p>
          </div>
          <p className="text-base capitalize">
            {userData?.firstName} {userData?.lastName}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuItem onClick={onLogout}>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

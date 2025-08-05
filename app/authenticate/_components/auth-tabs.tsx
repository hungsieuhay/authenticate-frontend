'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormRegister } from './form-register';
import { FormLogin } from './form-login';

export const AuthTabs = () => {
  return (
    <div className="mx-auto p-10">
      <Tabs defaultValue="Sign up" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="Sign up">Sign up</TabsTrigger>
          <TabsTrigger value="Log in">Log in</TabsTrigger>
        </TabsList>
        <TabsContent value="Sign up">
          <FormRegister />
        </TabsContent>
        <TabsContent value="Log in">
          <FormLogin />
        </TabsContent>
      </Tabs>
    </div>
  );
};

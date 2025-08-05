'use client';

import authApi from '@/app/api/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import dayjs from '@/lib/dayjs';
import sleep from '@/lib/sleep';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: 'First name must be at least 2 characters.',
  }),
  lastName: z.string().min(2, {
    message: 'Last name must be at least 2 characters.',
  }),
  email: z.email('Not invalid email'),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
});

type registerForm = z.infer<typeof formSchema>;

export const FormRegister = () => {
  const form = useForm<registerForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
    },
  });
  const router = useRouter();

  const onToastMessage = () =>
    toast('Register successful', {
      description: dayjs().format('DD MMMM YYYY'),
    });

  const onSubmit = async (values: registerForm) => {
    try {
      await authApi.register(values);
      onToastMessage();
      await sleep(1000);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card max-w-md space-y-8 rounded-lg border p-5 shadow-sm"
      >
        <div className="flex shrink-0 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>First name:</FormLabel>
                <FormControl>
                  <Input placeholder="This is your first name." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="basis-1/2">
                <FormLabel>Last name:</FormLabel>
                <FormControl>
                  <Input placeholder="This is your last name." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email:</FormLabel>
              <FormControl>
                <Input placeholder="This is your email." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password:</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="This is your password."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

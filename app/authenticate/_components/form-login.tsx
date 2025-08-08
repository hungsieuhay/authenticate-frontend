'use client';

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
import { useAuth } from '@/contexts/auth-context';
import dayjs from '@/lib/dayjs';
import sleep from '@/lib/sleep';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  email: z.email('Not invalid email'),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters',
  }),
});

type loginForm = z.infer<typeof formSchema>;

export const FormLogin = () => {
  const form = useForm<loginForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      email: '',
    },
  });
  const router = useRouter();
  const { login } = useAuth();

  const onToastMessage = () =>
    toast('Login successful', {
      description: dayjs().format('DD MMMM YYYY'),
    });

  const onSubmit = async (values: loginForm) => {
    try {
      await login(values);
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

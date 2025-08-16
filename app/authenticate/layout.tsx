import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In / Sign Up - Your App',
  description:
    'Sign in to your account or create a new account to access all features of our application.',
  openGraph: {
    title: 'Sign In / Sign Up - Your App',
    description:
      'Sign in to your account or create a new account to access all features of our application.',
    url: '/authenticate',
    images: [
      {
        url: '/og-auth.jpg',
        width: 1200,
        height: 630,
        alt: 'Sign In to Your App',
      },
    ],
  },
  twitter: {
    title: 'Sign In / Sign Up - Your App',
    description:
      'Sign in to your account or create a new account to access all features of our application.',
  },
  robots: {
    index: false, // Don't index auth pages
    follow: true,
  },
};

export default function AuthenticateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import MainLayout from '@/layout';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/provider/theme-provider';
import {
  StructuredData,
  organizationSchema,
  websiteSchema,
  webApplicationSchema,
} from '@/components/structured-data';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Your App Name - Professional Web Application',
    template: '%s | Your App Name',
  },
  description:
    'A modern, secure web application built with Next.js, featuring user authentication and responsive design.',
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Web Application',
    'Authentication',
    'Modern UI',
  ],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://yourdomain.com'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Your App Name - Professional Web Application',
    description:
      'A modern, secure web application built with Next.js, featuring user authentication and responsive design.',
    siteName: 'Your App Name',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your App Name',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your App Name - Professional Web Application',
    description:
      'A modern, secure web application built with Next.js, featuring user authentication and responsive design.',
    images: ['/og-image.jpg'],
    creator: '@yourusername',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <StructuredData data={organizationSchema} />
            <StructuredData data={websiteSchema} />
            <StructuredData data={webApplicationSchema} />
            <Toaster />
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

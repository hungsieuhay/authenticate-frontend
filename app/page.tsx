import { Metadata } from 'next';
import { ProductList } from './section/product-list';

export const metadata: Metadata = {
  title: 'Home - Welcome to Your App',
  description:
    'Welcome to our modern web application. Get started with our powerful features and intuitive interface.',
  openGraph: {
    title: 'Home - Welcome to Your App',
    description:
      'Welcome to our modern web application. Get started with our powerful features and intuitive interface.',
    url: '/',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Welcome to Your App',
      },
    ],
  },
  twitter: {
    title: 'Home - Welcome to Your App',
    description:
      'Welcome to our modern web application. Get started with our powerful features and intuitive interface.',
  },
};

export default function Home() {
  return <ProductList />;
}

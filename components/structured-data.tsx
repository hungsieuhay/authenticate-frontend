'use client';

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Common structured data schemas
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Your Company Name',
  url: 'https://yourdomain.com',
  logo: 'https://yourdomain.com/logo.png',
  description: 'Your company description',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
    availableLanguage: 'English',
  },
  sameAs: [
    'https://www.facebook.com/yourcompany',
    'https://www.twitter.com/yourcompany',
    'https://www.linkedin.com/company/yourcompany',
  ],
};

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Your App Name',
  url: 'https://yourdomain.com',
  description: 'A modern, secure web application built with Next.js',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://yourdomain.com/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Your App Name',
  url: 'https://yourdomain.com',
  description: 'A modern, secure web application built with Next.js',
  applicationCategory: 'WebApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

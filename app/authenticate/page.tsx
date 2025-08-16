'use client';

import { AuthTabs } from './_components/auth-tabs';
import { Metadata } from 'next';

// Note: Since this is a client component, we'll need to handle SEO differently
// We'll create a layout.tsx file for this route to handle metadata

const LoginPage = () => {
  return (
    <section className="container">
      <div className="flex flex-col">
        <AuthTabs />
      </div>
    </section>
  );
};

export default LoginPage;

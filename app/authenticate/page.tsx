'use client';

import { AuthTabs } from './_components/auth-tabs';

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

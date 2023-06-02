import React from 'react';

import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ['latin'] });

import { clsx } from 'clsx';

import { TRPCProvider } from '@/components/TRPCProvider';
import { AuthProvider } from '@/context/Auth';
import { ClientTranslationsProvider } from '@/context/ClientTranslations';
import { type Locale } from '@/lib/i18n';
import { getTranslations } from '@/utils/get-translations';

import '@/styles/index.css';

export const metadata = {
  title: 'Data Bank',
  description: 'Minimum Viable Product'
};

export default async function Root({ children, params }: { children: React.ReactNode; params: { locale: Locale } }) {
  const translations = await getTranslations(params.locale);
  const cookieStore = cookies();

  const accessToken = cookieStore.get('access_token');
  const theme = cookieStore.get('theme'); // try and get system theme here?

  return (
    <html className={theme?.value} lang={params.locale}>
      <body className={clsx(inter.className, 'bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-white')}>
        <ClientTranslationsProvider translations={translations}>
          <AuthProvider accessToken={accessToken?.value ?? null}>
            <TRPCProvider>{children}</TRPCProvider>
          </AuthProvider>
        </ClientTranslationsProvider>
      </body>
    </html>
  );
}

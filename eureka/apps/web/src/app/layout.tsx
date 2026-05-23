import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { CookieConsentBanner } from '@/components/cookie-consent';
import './globals.css';

// Avoid next/font/google (downloads at build/request time) — breaks offline/Docker/firewalls
// and can contribute to flaky responses. Tailwind `font-sans` uses the system stack.

export const metadata: Metadata = {
  title: 'EUREKA - Educational Platform',
  description: 'Universal Reasoning & Enhanced Knowledge Architecture for all educational tiers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
        <CookieConsentBanner />
      </body>
    </html>
  );
}

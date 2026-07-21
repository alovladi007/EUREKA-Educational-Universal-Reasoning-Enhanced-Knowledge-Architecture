import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { CookieConsentBanner } from '@/components/cookie-consent';
import './globals.css';

// Avoid next/font/google (downloads at build/request time) — breaks offline/Docker/firewalls
// and can contribute to flaky responses. Tailwind `font-sans` uses the system stack.

const SITE_DESCRIPTION =
  'Master any subject with adaptive courses, graded practice, and a personal AI tutor — from high school to professional degrees. Free to start; enterprise-ready for institutions.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eureka.example.com'),
  title: {
    default: 'EUREKA — Learn. Discover. Master.',
    template: '%s · EUREKA',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'online learning',
    'adaptive learning',
    'AI tutor',
    'test prep',
    'mathematics',
    'certificates',
    'LMS',
    'education platform',
  ],
  applicationName: 'EUREKA',
  openGraph: {
    type: 'website',
    siteName: 'EUREKA',
    title: 'EUREKA — Learn. Discover. Master.',
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EUREKA — Learn. Discover. Master.',
    description: SITE_DESCRIPTION,
  },
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

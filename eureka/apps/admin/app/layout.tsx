import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EUREKA Admin',
  description: 'EUREKA platform administration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 24 }}>{children}</body>
    </html>
  );
}

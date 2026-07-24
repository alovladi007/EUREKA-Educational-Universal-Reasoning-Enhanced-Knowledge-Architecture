import type { Metadata } from 'next';
import './globals.css';
import { AuthGate } from '@/app/_ui/shell';

export const metadata: Metadata = {
  title: 'OCTET - Chemistry on EUREKA',
  description:
    'OCTET - Orbitals, Compounds, Thermodynamics, Equilibria, Transformations. The chemistry vertical of the EUREKA platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AXIOM - Mathematics on EUREKA',
  description:
    'AXIOM - Adaptive eXpert Instruction and Outcome Measurement. The mathematics vertical of the EUREKA platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

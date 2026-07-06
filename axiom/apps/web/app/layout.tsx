import type { Metadata } from 'next';
import './globals.css';
// KaTeX stylesheet, loaded once for the whole app. It ships the math fonts and
// the layout rules the RichMath / InlineMath / BlockMath components rely on.
import 'katex/dist/katex.min.css';
import { AuthGate } from '@/components/AuthGate';

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
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}

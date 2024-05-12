import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/shadcn/toaster';

export const metadata: Metadata = {
  title: 'SlowTunes — Slowed & Reverb Music Generator',
  description: 'Generate slowed and reverb music with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={GeistSans.className}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

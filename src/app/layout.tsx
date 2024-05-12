import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/shadcn/toaster';
import Script from 'next/script';

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
      {process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL &&
        process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_ID && (
          <Script
            src={process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_URL}
            data-website-id={process.env.NEXT_PUBLIC_ANALYTICS_SCRIPT_ID}
          />
        )}
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Unbounded, Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const fontManrope = Manrope({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-manrope',
});

const fontUnbounded = Unbounded({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-unbounded',
});

export const metadata: Metadata = {
  title: '100% Free Dental Business Name Generator Tool. No Signups.',
  description:
    '100% free dental business name generator. No signup. Get instant name ideas + domain & country TLD checks, brand guidelines, and color palettes.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: '100% Free Dental Business Name Generator Tool. No Signups.',
    description:
      '100% free dental business name generator. No signup. Get instant name ideas + domain & country TLD checks, brand guidelines, and color palettes.',
    url: 'https://pracxcel.com.au', // Replace with actual domain
    siteName: 'Pracxcel',
    images: [
      {
        url: '/og-image.png', // Replace with actual OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          'min-h-screen bg-background font-body antialiased',
          fontManrope.variable,
          fontUnbounded.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

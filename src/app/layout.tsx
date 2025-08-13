import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const fontPoppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Dental NameCraft AI – AI-Powered Naming Tool for Dentists',
  description:
    'Generate unique dental business names, taglines, and logos with AI. Check domain availability and get a full brand kit for your new practice.',
  openGraph: {
    title: 'Dental NameCraft AI – AI-Powered Naming Tool for Dentists',
    description:
      'Generate unique dental business names, taglines, and logos with AI. Check domain availability and get a full brand kit for your new practice.',
    url: 'https://dental-namecraft-ai.com', // Replace with actual domain
    siteName: 'Dental NameCraft AI',
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
    <html lang="en">
      <body suppressHydrationWarning className={cn('min-h-screen bg-background font-sans antialiased', fontInter.variable, fontPoppins.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

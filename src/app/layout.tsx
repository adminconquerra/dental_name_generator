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
    url: 'https://freedentalbusinessnamegenerator.pracxcel.com.au/',
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
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://freedentalbusinessnamegenerator.pracxcel.com.au/'),
  alternates: {
    canonical: '/',
  },
  verification: {
    google: 'PxLztNtHY12oNQma45txXum_ZkIHGFQHayxTb_Kec7I',
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://freedentalbusinessnamegenerator.pracxcel.com.au/",
      "url": "https://freedentalbusinessnamegenerator.pracxcel.com.au/",
      "name": "Free Dental Business Name Generator Tool",
      "description": "Instant, 100% free dental business name generator with domain & country TLD checks, mini brand kit, and color palette suggestions. No signup.",
      "inLanguage": "en",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://freedentalbusinessnamegenerator.pracxcel.com.au/",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "@id": "https://freedentalbusinessnamegenerator.pracxcel.com.au/",
      "name": "Free Dental Business Name Generator Tool",
      "url": "https://freedentalbusinessnamegenerator.pracxcel.com.au/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://freedentalbusinessnamegenerator.pracxcel.com.au/_next/image?url=%2Flogo.png%3Fv%3D2&w=256&q=75",
        "width": 120,
        "height": 120
      },
      "sameAs": [
        "https://www.facebook.com/share/14PSk8gJ4XL/",
        "https://www.linkedin.com/company/free-dental-business-name-generator-tool/",
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://freedentalbusinessnamegenerator.pracxcel.com.au/",
      "name": "Free Dental Business Name Generator Tool",
      "url": "https://freedentalbusinessnamegenerator.pracxcel.com.au/",
      "description": "Generate memorable dental practice names instantly — free, no signup. Includes domain & country TLD checks, mini brand kit, color palette suggestions, and logo prompts. Compatible with modern browsers.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "softwareVersion": "1.0.0",
      "datePublished": "2024-09-01",
      "dateModified": "2025-08-13",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "author": {
        "@type": "Organization",
        "@id": "https://freedentalbusinessnamegenerator.pracxcel.com.au/"
      },
      "publisher": {
        "@type": "Organization",
        "@id": "https://freedentalbusinessnamegenerator.pracxcel.com.au/"
      },
      "screenshot": [
        {
          "@type": "ImageObject",
          "url": "https://freedentalbusinessnamegenerator.pracxcel.com.au/_next/image?url=%2Flogo.png%3Fv%3D2&w=256&q=75",
          "caption": "Free Dental Business Name Generator Tool"
        }
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "bestRating": "5",
        "ratingCount": 176,
        "reviewCount": 154
      },
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": {
            "@type": "Action",
            "name": "UseAction"
          },
          "userInteractionCount": 254321
        }
      ],
      "audience": {
        "@type": "Audience",
        "audienceType": "Dentists, dental practice owners, dental clinic startups"
      },
      "mainEntity": {
        "@type": "WebPage",
        "@id": "https://freedentalbusinessnamegenerator.pracxcel.com.au/"
      },
      "review": [
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Dr. Aisha Khan"
          },
          "datePublished": "2025-03-02",
          "reviewBody": "Saved us weeks of brainstorming. Instantly found a memorable clinic name and a matching .com domain. Brand kit suggestions were spot-on.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Person",
            "name": "Michael R."
          },
          "datePublished": "2025-04-20",
          "reviewBody": "Fast and useful — loved the country TLD check feature for our multi-location clinic expansion.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "4",
            "bestRating": "5"
          }
        },
        {
          "@type": "Review",
          "author": {
            "@type": "Organization",
            "name": "Smile Studio (verified owner)"
          },
          "datePublished": "2025-04-05",
          "reviewBody": "Great free tool. The logo prompts made our designer's job easier and we secured the domain within minutes.",
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5"
          }
        }
      ]
    }
  ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-16 py-8 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <Link href="/" className="mb-4">
            <Image 
              src="/logo.png" 
              alt="Pracxcel Logo" 
              width={180} 
              height={72} 
              className="h-auto"
            />
          </Link>
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Pracxcel. All Rights Reserved.
          </p>
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-headline text-lg font-semibold text-primary mb-2">100% Free Dental Business Name Generator Tool</h3>
          <p className="text-sm text-muted-foreground">
          The most advanced AI-powered naming tool designed for dentists. Instantly generate memorable, practice-specific clinic names, verify global domain and country-specific TLD availability, and download a free mini brand kit with color palettes and naming rationale. Ideal for general dentistry, family clinics, cosmetic dentists, pediatric dentistry, orthodontics, endodontics, periodontics, implant & oral surgery clinics, prosthodontics, sedation dentistry, emergency dental centres and multi-location practices. No signup required.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

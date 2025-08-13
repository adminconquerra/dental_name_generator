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
          <h3 className="font-headline text-lg font-semibold text-primary mb-2">The Best Free Dental Business Name Generator</h3>
          <p className="text-sm text-muted-foreground">
            Struggling to find the perfect name for your new clinic? Our free dental business name generator tool is here to help. Powered by advanced AI, this tool provides instant, creative, and professional name suggestions tailored to your practice. Whether you're a general, pediatric, or cosmetic dentist, our free dental business name generator tool helps you create a memorable brand identity, check domain availability, and even get a full brand kit. Start building your brand today with the ultimate free dental business name generator tool.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

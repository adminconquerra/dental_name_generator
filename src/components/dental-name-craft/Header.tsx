import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4">
        <Image src="/logo.png" alt="Pracxcel Logo" width={250} height={100} className="h-auto" />
      </div>
      <h1 className="mt-4 text-3xl md:text-4xl font-headline font-bold text-white leading-tight">
        100% Free Dental Name Generator Tool for Dentists | Domains, TLDs & Brand Kit
      </h1>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Your AI-powered partner for crafting the perfect dental brand identity.
        Generate names and taglines in seconds.
      </p>
    </header>
  );
};

export default Header;

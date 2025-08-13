import React from 'react';
import { LogoIcon } from './icons/LogoIcon';

const Header = () => {
  return (
    <header className="text-center">
      <div className="flex justify-center items-center gap-4">
        <LogoIcon className="h-12 w-12 text-primary" />
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary tracking-tight">
          Dental NameCraft AI
        </h1>
      </div>
      <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
        Your AI-powered partner for crafting the perfect dental brand identity.
        Generate names, logos, and taglines in seconds.
      </p>
    </header>
  );
};

export default Header;

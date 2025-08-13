'use client';

import { Rocket } from 'lucide-react';
import Link from 'next/link';

const CtaStrip = () => {
    return (
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center">
            <div className="container mx-auto flex items-center justify-center gap-4">
                <Rocket className="h-6 w-6" />
                <p className="font-semibold text-sm sm:text-base">
                    <strong>Launch Your New Clinic with Confidence.</strong> Discover how many new patients you could attract with a free marketing estimate from
                    <Link
                        href="https://pracxcel.com.au"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline ml-2 hover:opacity-80 transition-opacity"
                    >
                        Pracxcel.
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CtaStrip;

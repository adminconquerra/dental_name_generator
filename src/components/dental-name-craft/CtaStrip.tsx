'use client';

import { Rocket } from 'lucide-react';
import Link from 'next/link';

const CtaStrip = () => {
    return (
        <div className="bg-primary text-primary-foreground py-3 px-4 text-center">
            <div className="container mx-auto flex items-center justify-center gap-4">
                <Rocket className="h-6 w-6" />
                <p className="font-semibold text-sm sm:text-base">
                    Starting a new practice? Get a free estimate of how many patients you can acquire.
                    <Link
                        href="https://pracxcel.com.au"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline ml-2 hover:opacity-80 transition-opacity"
                    >
                        Learn More
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CtaStrip;

'use client';

import { Rocket } from 'lucide-react';
import Link from 'next/link';

const CtaStrip = () => {
    return (
        <div className="bg-primary text-white py-3 px-4 text-center">
            <div className="container mx-auto flex items-start justify-center gap-4">
                <Rocket className="h-6 w-6 flex-shrink-0 mt-1" />
                <p className="font-semibold text-sm sm:text-base">
                    Worried about patient numbers? Launch with confidence. Guaranteed patients or your money back. Get started with a free audit & strategy session valued at $3000!
                    <Link
                        href="https://pracxcel.com.au"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold underline ml-2 hover:opacity-80 transition-opacity"
                    >
                        GRAB IT NOW.
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CtaStrip;

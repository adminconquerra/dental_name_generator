import type { SVGProps } from 'react';

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12.25 2A2.25 2.25 0 0 0 10 4.25v2.515a3.739 3.739 0 0 1 0 .47v4.53a3.739 3.739 0 0 1 0 .47v2.515A2.25 2.25 0 0 0 12.25 22h-.5A2.25 2.25 0 0 0 9.5 19.75V17.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2.25A2.25 2.25 0 0 0 7.75 22h-.5A4.25 4.25 0 0 1 3 17.75V6.25A4.25 4.25 0 0 1 7.25 2h.5A2.25 2.25 0 0 0 10 4.25v2.5a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V4.25A2.25 2.25 0 0 0 11.75 2h.5A4.25 4.25 0 0 1 16.5 6.25v11.5A4.25 4.25 0 0 1 12.25 22Z" />
      <path d="M14.5 17.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2.25A2.25 2.25 0 0 1 16.25 22h-.5a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      <path d="M14.5 4.25A2.25 2.25 0 0 1 16.75 2h.5A4.25 4.25 0 0 1 21.5 6.25V7.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2.5a1 1 0 0 1-1-1V4.25Z" />
    </svg>
  );
}

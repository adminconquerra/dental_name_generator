'use server';
/**
 * @fileOverview Implements a server-side IP-based rate limiter to prevent abuse.
 *
 * - isRateLimited - A function that checks if a request is rate-limited.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { headers } from 'next/headers';

const ipRequestCounts = new Map<string, { count: number; lastRequest: number }>();
const RATE_LIMIT_THRESHOLD = 10; // Max requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

const isRateLimitedFlow = ai.defineFlow(
  {
    name: 'isRateLimitedFlow',
    inputSchema: z.void(),
    outputSchema: z.boolean(),
  },
  async () => {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    
    const record = ipRequestCounts.get(ip);

    if (!record || now - record.lastRequest > RATE_LIMIT_WINDOW) {
      // If no record or the window has passed, reset the count.
      ipRequestCounts.set(ip, { count: 1, lastRequest: now });
      return false;
    }

    if (record.count >= RATE_LIMIT_THRESHOLD) {
      // If the count exceeds the threshold, they are rate-limited.
      return true;
    }

    // Increment the count.
    record.count++;
    record.lastRequest = now;
    ipRequestCounts.set(ip, record);

    return false;
  }
);


export async function isRateLimited(): Promise<boolean> {
    return await isRateLimitedFlow();
}

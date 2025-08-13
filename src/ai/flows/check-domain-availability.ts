'use server';
/**
 * @fileOverview Checks domain availability for a given name across specified TLDs.
 *
 * - checkDomainAvailability - A function that checks domain availability.
 * - CheckDomainAvailabilityInput - The input type for the checkDomainAvailability function.
 * - CheckDomainAvailabilityOutput - The return type for the checkDomainAvailability function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as dns from 'node:dns/promises';

const CheckDomainAvailabilityInputSchema = z.object({
  name: z.string().describe('The business name to check.'),
  extensions: z.array(z.string()).describe('An array of domain extensions to check (e.g., [".com", ".clinic"]).'),
});
export type CheckDomainAvailabilityInput = z.infer<typeof CheckDomainAvailabilityInputSchema>;

const DomainAvailabilityResultSchema = z.object({
  domain: z.string(),
  available: z.boolean(),
});

const CheckDomainAvailabilityOutputSchema = z.array(DomainAvailabilityResultSchema);
export type CheckDomainAvailabilityOutput = z.infer<typeof CheckDomainAvailabilityOutputSchema>;


const checkAvailabilityTool = ai.defineTool(
    {
      name: 'checkAvailabilityTool',
      description: 'Check if a domain name is available or taken.',
      inputSchema: z.object({ domain: z.string().describe("The domain name to check, e.g. example.com") }),
      outputSchema: z.boolean(),
    },
    async ({domain}) => {
      try {
        await dns.lookup(domain);
        return false; // Found, so it's unavailable
      } catch (e: any) {
        if (e.code === 'ENOTFOUND') {
          return true; // Not found, so it's available
        }
        // Other errors might indicate network issues, etc.
        // For simplicity, we'll treat them as "unavailable"
        return false; 
      }
    }
);


export async function checkDomainAvailability(
  input: CheckDomainAvailabilityInput
): Promise<CheckDomainAvailabilityOutput> {
  return checkDomainAvailabilityFlow(input);
}


const checkDomainAvailabilityFlow = ai.defineFlow(
  {
    name: 'checkDomainAvailabilityFlow',
    inputSchema: CheckDomainAvailabilityInputSchema,
    outputSchema: CheckDomainAvailabilityOutputSchema,
    tools: [checkAvailabilityTool],
  },
  async ({name, extensions}) => {
    const sanitizedName = name.replace(/\s+/g, '').toLowerCase();

    const checks = extensions.map(async (ext) => {
        const domain = `${sanitizedName}${ext}`;
        const available = await checkAvailabilityTool({ domain });
        return { domain, available };
    });

    const results = await Promise.all(checks);
    return results;
  }
);

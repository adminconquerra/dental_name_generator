'use server';
/**
 * @fileOverview Generates a tagline and social media bio for a given business name.
 *
 * - generateTaglineAndBio - A function that handles the tagline and bio generation.
 * - GenerateTaglineAndBioInput - The input type for the generateTaglineAndBio function.
 * - GenerateTaglineAndBioOutput - The return type for the generateTaglineAndBio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTaglineAndBioInputSchema = z.object({
  businessName: z.string().describe('The name of the business.'),
  brandPersonality: z.string().describe('The brand personality of the business.'),
});
export type GenerateTaglineAndBioInput = z.infer<typeof GenerateTaglineAndBioInputSchema>;

const GenerateTaglineAndBioOutputSchema = z.object({
  tagline: z.string().describe('A one-line tagline for the business.'),
  socialMediaBio: z.string().describe('A short social media bio (150 characters max) for the business.'),
});
export type GenerateTaglineAndBioOutput = z.infer<typeof GenerateTaglineAndBioOutputSchema>;

export async function generateTaglineAndBio(input: GenerateTaglineAndBioInput): Promise<GenerateTaglineAndBioOutput> {
  return generateTaglineAndBioFlow(input);
}

const generateTaglineAndBioPrompt = ai.definePrompt({
  name: 'generateTaglineAndBioPrompt',
  input: {schema: GenerateTaglineAndBioInputSchema},
  output: {schema: GenerateTaglineAndBioOutputSchema},
  prompt: `You are a branding expert specializing in creating taglines and social media bios for businesses.

  Generate a one-line tagline and a short social media bio (150 characters max) for the following business:

  Business Name: {{{businessName}}}
  Brand Personality: {{{brandPersonality}}}

  Tagline:
  Social Media Bio:`,
});

const generateTaglineAndBioFlow = ai.defineFlow(
  {
    name: 'generateTaglineAndBioFlow',
    inputSchema: GenerateTaglineAndBioInputSchema,
    outputSchema: GenerateTaglineAndBioOutputSchema,
  },
  async input => {
    const {output} = await generateTaglineAndBioPrompt(input);
    return output!;
  }
);

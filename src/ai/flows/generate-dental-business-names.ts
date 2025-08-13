'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating dental business name ideas.
 *
 * The flow takes various inputs such as practice type, location, target audience, brand personality, and keywords,
 * and uses OpenAI to generate multiple name ideas. It then scores each name based on pronounceability and
 * overall suitability.
 *
 * @exports generateDentalBusinessNames - The main function to trigger the flow.
 * @exports GenerateDentalBusinessNamesInput - The input type for the flow.
 * @exports GenerateDentalBusinessNamesOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDentalBusinessNamesInputSchema = z.object({
  practiceType: z.string().describe('Type of dental practice (e.g., General, Pediatric).'),
  location: z.string().describe('City or suburb (e.g., Austin).'),
  targetAudience: z.array(z.string()).describe('Target audience (e.g., Families, Kids).'),
  brandPersonality: z.array(z.string()).describe('Brand personality (e.g., Friendly, Professional).'),
  mustIncludeWords: z.string().optional().describe('Comma-separated words to include.'),
  wordsToAvoid: z.string().optional().describe('Comma-separated words to avoid.'),
  maxNameLength: z.number().optional().describe('Maximum name length in characters or words.'),
  includeOwnerName: z.boolean().optional().describe('Whether to include the owner name.'),
  ownerName: z.string().optional().describe('The name of the owner.'),
});
export type GenerateDentalBusinessNamesInput = z.infer<typeof GenerateDentalBusinessNamesInputSchema>;

const DentalBusinessNameSchema = z.object({
  name: z.string().describe('Generated dental business name.'),
  rationale: z.string().describe('Rationale for the generated name.'),
  pronounceabilityScore: z.number().describe('Pronounceability score (0-10).'),
  totalNameScore: z.number().describe('Total name score (0-100).'),
});

const GenerateDentalBusinessNamesOutputSchema = z.array(DentalBusinessNameSchema);
export type GenerateDentalBusinessNamesOutput = z.infer<typeof GenerateDentalBusinessNamesOutputSchema>;

export async function generateDentalBusinessNames(input: GenerateDentalBusinessNamesInput): Promise<GenerateDentalBusinessNamesOutput> {
  return generateDentalBusinessNamesFlow(input);
}

const generateNamesPrompt = ai.definePrompt({
  name: 'generateNamesPrompt',
  input: {schema: GenerateDentalBusinessNamesInputSchema},
  output: {schema: GenerateDentalBusinessNamesOutputSchema},
  prompt: `You are a creative brand name generator for dental businesses. Generate multiple name ideas based on the following criteria:

Practice Type: {{{practiceType}}}
Location: {{{location}}}
Target Audience: {{{targetAudience}}}
Brand Personality: {{{brandPersonality}}}
Must-Include Words: {{{mustIncludeWords}}}
Words to Avoid: {{{wordsToAvoid}}}
Max Name Length: {{{maxNameLength}}}

{{#if includeOwnerName}}
Include Owner Name: Yes, the owner's name is {{{ownerName}}}.
{{/if}}

Important: While the location is provided for context, do not include it in every name. Strive for a good balance of names with and without the location. Some names can be creative and not tied to the location at all.

For each name, provide a 1-line rationale, a pronounceability score (0-10), and a total name score (0-100). Return in JSON format.
`,
});

const generateDentalBusinessNamesFlow = ai.defineFlow(
  {
    name: 'generateDentalBusinessNamesFlow',
    inputSchema: GenerateDentalBusinessNamesInputSchema,
    outputSchema: GenerateDentalBusinessNamesOutputSchema,
  },
  async input => {
    const {output} = await generateNamesPrompt(input);
    return output!;
  }
);

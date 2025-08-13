'use server';

/**
 * @fileOverview Scores dental business names based on pronounceability and suitability.
 *
 * - scoreDentalBusinessName - A function that scores a dental business name.
 * - ScoreDentalBusinessNameInput - The input type for the scoreDentalBusinessName function.
 * - ScoreDentalBusinessNameOutput - The return type for the scoreDentalBusinessName function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import {z} from 'genkit';

const ScoreDentalBusinessNameInputSchema = z.object({
  name: z.string().describe('The dental business name to score.'),
  practiceType: z.string().describe('The type of dental practice.'),
  location: z.string().describe('The location of the dental practice.'),
  targetAudience: z.array(z.string()).describe('The target audience of the dental practice.'),
  brandPersonality: z.array(z.string()).describe('The brand personality of the dental practice.'),
  mustIncludeWords: z.string().optional().describe('Words that must be included in the name.'),
  wordsToAvoid: z.string().optional().describe('Words to avoid in the name.'),
});
export type ScoreDentalBusinessNameInput = z.infer<typeof ScoreDentalBusinessNameInputSchema>;

const ScoreDentalBusinessNameOutputSchema = z.object({
  pronounceabilityScore: z.number().describe('A score from 0-10 indicating how easy the name is to pronounce.'),
  suitabilityScore: z.number().describe('A score from 0-100 indicating how suitable the name is for a dental business.'),
  rationale: z.string().describe('A rationale for the given scores.'),
});
export type ScoreDentalBusinessNameOutput = z.infer<typeof ScoreDentalBusinessNameOutputSchema>;

export async function scoreDentalBusinessName(
  input: ScoreDentalBusinessNameInput
): Promise<ScoreDentalBusinessNameOutput> {
  return scoreDentalBusinessNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scoreDentalBusinessNamePrompt',
  input: {schema: ScoreDentalBusinessNameInputSchema},
  output: {schema: ScoreDentalBusinessNameOutputSchema},
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are an expert in branding and naming for dental businesses.

You will receive a dental business name, and you will score it based on its pronounceability and suitability for a dental business.

Consider the following information about the dental business when scoring the name:

Practice Type: {{practiceType}}
Location: {{location}}
Target Audience: {{targetAudience}}
Brand Personality: {{brandPersonality}}
Must Include Words: {{mustIncludeWords}}
Words to Avoid: {{wordsToAvoid}}

Provide a pronounceability score from 0-10, where 10 is the easiest to pronounce.
Provide a suitability score from 0-100, where 100 is the most suitable.
Provide a rationale for the scores you have given.

Name: {{name}}`,
});

const scoreDentalBusinessNameFlow = ai.defineFlow(
  {
    name: 'scoreDentalBusinessNameFlow',
    inputSchema: ScoreDentalBusinessNameInputSchema,
    outputSchema: ScoreDentalBusinessNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

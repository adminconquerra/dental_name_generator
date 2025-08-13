'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating dental business name ideas.
 *
 * The flow takes various inputs such as practice type, location, target audience, brand personality, and keywords,
 * and uses an LLM to generate multiple name ideas. For each name, it also generates a rationale, scores,
 * a unique brand kit (colors and fonts), and SEO metadata.
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

const ColorPaletteSchema = z.object({
  primary: z.string().describe('Primary color hex code (e.g., #3870A4).'),
  accent: z.string().describe('Accent color hex code (e.g., #A7E0DD).'),
  background: z.string().describe('Background color hex code (e.g., #F0F2F5).'),
  foreground: z.string().describe('Foreground color hex code (e.g., #2D3748).'),
});

const BrandKitSchema = z.object({
  headingFont: z.string().describe("Font for headings (e.g., 'Poppins')."),
  bodyFont: z.string().describe("Font for UI/body text (e.g., 'Inter')."),
  colorPalette: ColorPaletteSchema,
});

const SeoMetadataSchema = z.object({
  title: z.string().describe('SEO title tag for the business.'),
  description: z.string().describe('SEO meta description for the business.'),
});

const DentalBusinessNameSchema = z.object({
  name: z.string().describe('Generated dental business name.'),
  rationale: z.string().describe('Rationale for the generated name.'),
  pronounceabilityScore: z.number().describe('Pronounceability score (0-10).'),
  totalNameScore: z.number().describe('Total name score (0-100).'),
  brandKit: BrandKitSchema.describe('A unique brand kit for this name.'),
  seo: SeoMetadataSchema.describe('Unique SEO metadata for this name.'),
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
  prompt: `You are a creative brand name generator for dental businesses. Generate at least 12 name ideas based on the following criteria:

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

For each name, provide:
1.  A 1-line rationale.
2.  A pronounceability score (0-10).
3.  A total name score (0-100).
4.  A unique brand kit:
    -   Suggest a professional heading font (e.g., 'Poppins', 'Montserrat').
    -   Suggest a readable body font (e.g., 'Inter', 'Lato', 'Roboto').
    -   Generate a color palette with hex codes for primary, accent, background, and foreground colors. The palette should be inspired by the brand personality but maintain a professional, calming dental aesthetic.
5.  Unique SEO metadata:
    -   A title tag (e.g., "{Business Name} | {Location} | Quality Dental Care").
    -   A meta description (e.g., "Discover top-tier dental services at {Business Name}. We offer a wide range of treatments for the whole family. Book your appointment today!").

Return the full response in a valid JSON array format.
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

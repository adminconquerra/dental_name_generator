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
import { googleAI } from '@genkit-ai/googleai';

const GenerateDentalBusinessNamesInputSchema = z.object({
  practiceType: z.string().describe('Type of dental practice (e.g., General, Pediatric).'),
  location: z.string().describe('City or suburb (e.g., Austin).'),
  country: z.string().describe('Country of the practice (e.g., Australia).'),
  targetAudience: z.array(z.string()).describe('Target audience (e.g., Families, Kids).'),
  brandPersonality: z.array(z.string()).describe('Brand personality (e.g., Friendly, Professional).'),
  mustIncludeWords: z.string().optional().describe('Comma-separated words to include.'),
  wordsToAvoid: z.string().optional().describe('Comma-separated words to avoid.'),
  maxNameLength: z.coerce.number().positive().optional().describe('Maximum name length in characters or words.'),
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
  headingFont: z.string().describe("Font for headings (e.g., 'Poppins', 'Montserrat')."),
  bodyFont: z.string().describe("Font for UI/body text (e.g., 'Inter', 'Lato', 'Roboto')."),
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
  model: googleAI.model('gemini-1.5-flash-latest'),
  prompt: `You are a JSON API for generating dental business names. Do not provide any conversational text, introductions, or markdown formatting. Your response must be only the valid JSON array.

Generate at least 12 name ideas based on the following criteria:

Practice Type: {{{practiceType}}}
Location: {{{location}}}
Country: {{{country}}}
Target Audience: {{{targetAudience}}}
Brand Personality: {{{brandPersonality}}}
Must-Include Words: {{{mustIncludeWords}}}
Words to Avoid: {{{wordsToAvoid}}}
Max Name Length: {{{maxNameLength}}}

{{#if includeOwnerName}}
Include Owner Name: Yes, the owner's name is {{{ownerName}}}.
{{/if}}

Important: While the location is provided for context, do not include it in every name. Strive for a good balance of names with and without the location. Some names can be creative and not tied to the location at all.

For each name in the JSON array, you must provide an object with the following properties:
- name: The generated dental business name (string).
- rationale: A 1-line rationale for the name (string).
- pronounceabilityScore: A score from 0-10 (number).
- totalNameScore: A score from 0-100 (number).
- brandKit: An object with:
    - headingFont: A professional heading font (string).
    - bodyFont: A readable body font (string).
    - colorPalette: An object with primary, accent, background, and foreground hex codes (strings).
- seo: An object with:
    - title: An SEO title tag (string).
    - description: An SEO meta description (string).

Your entire output must be a single, valid JSON array conforming to this structure.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const generateDentalBusinessNamesFlow = ai.defineFlow(
  {
    name: 'generateDentalBusinessNamesFlow',
    inputSchema: GenerateDentalBusinessNamesInputSchema,
    outputSchema: GenerateDentalBusinessNamesOutputSchema,
  },
  async (input) => {
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const result = await generateNamesPrompt.generate({ input, stream: false });
        let rawText = result.text;
        
        // Clean the response by removing markdown fences
        rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        
        const parsedOutput = JSON.parse(rawText);
        
        // Validate the parsed output against the Zod schema
        const validationResult = GenerateDentalBusinessNamesOutputSchema.safeParse(parsedOutput);

        if (validationResult.success) {
          return validationResult.data;
        } else {
          // If validation fails, it's an invalid format, so we should retry
          throw new Error(`Invalid response format: ${validationResult.error.message}`);
        }
        
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error instanceof Error ? error.message : String(error));
        if (attempts >= maxAttempts) {
          // If all retries fail, propagate the error to the frontend
          throw new Error('Failed to generate business names after multiple attempts. Please try again later.');
        }
        // Exponential backoff with jitter
        const delay = (2 ** attempts) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    // This should not be reached, but as a final safeguard:
    throw new Error('An unexpected error occurred during name generation.');
  }
);

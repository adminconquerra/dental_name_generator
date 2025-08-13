import type { GenerateDentalBusinessNamesOutput, GenerateDentalBusinessNamesInput } from '@/ai/flows/generate-dental-business-names';
import type { GenerateTaglineAndBioOutput } from '@/ai/flows/generate-tagline-and-bio';
import type { GenerateLogoMockupOutput } from '@/ai/flows/generate-logo-mockup';


export type FormValues = GenerateDentalBusinessNamesInput;

export type NameData = GenerateDentalBusinessNamesOutput[0];

export type TaglineAndBio = GenerateTaglineAndBioOutput;

export type LogoData = GenerateLogoMockupOutput;

export type GenerationStatus = 'idle' | 'loading' | 'done' | 'error';

export interface GeneratedName extends NameData {
  logoDataUri?: string;
  taglineAndBio?: TaglineAndBio;
  isFavorite?: boolean;
  logoStatus: GenerationStatus;
  taglineStatus: GenerationStatus;
}

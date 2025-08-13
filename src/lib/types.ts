import type { GenerateDentalBusinessNamesOutput, GenerateDentalBusinessNamesInput } from '@/ai/flows/generate-dental-business-names';
import type { GenerateTaglineAndBioOutput } from '@/ai/flows/generate-tagline-and-bio';
import type { CheckDomainAvailabilityOutput } from '@/ai/flows/check-domain-availability';


export type FormValues = GenerateDentalBusinessNamesInput;

export type NameData = GenerateDentalBusinessNamesOutput[0];

export type TaglineAndBio = GenerateTaglineAndBioOutput;

export type DomainAvailability = CheckDomainAvailabilityOutput;

export type GenerationStatus = 'idle' | 'loading' | 'done' | 'error';

export interface GeneratedName extends NameData {
  taglineAndBio?: TaglineAndBio;
  domains?: Record<string, boolean>;
  isFavorite?: boolean;
  taglineStatus: GenerationStatus;
  domainStatus: GenerationStatus;
}

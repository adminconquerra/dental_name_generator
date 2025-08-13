'use client';

import type { FormValues, GeneratedName, TaglineAndBio, LogoData } from '@/lib/types';
import { useState } from 'react';
import { generateDentalBusinessNames } from '@/ai/flows/generate-dental-business-names';
import { generateTaglineAndBio } from '@/ai/flows/generate-tagline-and-bio';
import { generateLogoMockup } from '@/ai/flows/generate-logo-mockup';

import Header from '@/components/dental-name-craft/Header';
import GeneratorForm from '@/components/dental-name-craft/GeneratorForm';
import ResultsView from '@/components/dental-name-craft/ResultsView';
import NameDetailsModal from '@/components/dental-name-craft/NameDetailsModal';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [formInput, setFormInput] = useState<FormValues | null>(null);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<GeneratedName | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleGenerateNames = async (data: FormValues) => {
    setIsLoading(true);
    setError(null);
    setGeneratedNames([]);
    setFormInput(data);
    try {
      const results = await generateDentalBusinessNames(data);
      const namesWithStatus = results.map(name => ({
        ...name,
        logoStatus: 'idle',
        taglineStatus: 'idle',
      }));
      setGeneratedNames(namesWithStatus);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error Generating Names',
        description: 'Please try adjusting your criteria and submit again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNameInState = (name: string, updates: Partial<GeneratedName>) => {
    setGeneratedNames(prev =>
      prev.map(item => (item.name === name ? { ...item, ...updates } : item))
    );
    if (selectedName?.name === name) {
      setSelectedName(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleGenerateTaglineAndBio = async (name: string) => {
    if (!formInput) return;
    updateNameInState(name, { taglineStatus: 'loading' });
    try {
      const result = await generateTaglineAndBio({
        businessName: name,
        brandPersonality: formInput.brandPersonality.join(', '),
      });
      updateNameInState(name, { taglineAndBio: result, taglineStatus: 'done' });
    } catch (e) {
      updateNameInState(name, { taglineStatus: 'error' });
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate tagline and bio.' });
    }
  };

  const handleGenerateLogo = async (name: string) => {
    if (!formInput) return;
    updateNameInState(name, { logoStatus: 'loading' });
    try {
      const result = await generateLogoMockup({
        businessName: name,
        tone: formInput.brandPersonality.join(', '),
      });
      updateNameInState(name, { logoDataUri: result.logoDataUri, logoStatus: 'done' });
    } catch (e) {
      updateNameInState(name, { logoStatus: 'error' });
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate logo.' });
    }
  };

  const handleSelectName = (name: GeneratedName) => {
    setSelectedName(name);
    setIsModalOpen(true);
    if (!name.taglineAndBio && name.taglineStatus !== 'loading' && name.taglineStatus !== 'done') {
      handleGenerateTaglineAndBio(name.name);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 font-body">
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        <section id="generator" className="w-full mt-8">
          <GeneratorForm onSubmit={handleGenerateNames} isLoading={isLoading} />
        </section>
        <section id="results" className="w-full mt-12">
          <ResultsView
            names={generatedNames}
            isLoading={isLoading}
            onSelectName={handleSelectName}
            onGenerateLogo={handleGenerateLogo}
          />
        </section>
      </div>
      {selectedName && (
        <NameDetailsModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          nameData={selectedName}
          onGenerateLogo={handleGenerateLogo}
          onGenerateTagline={handleGenerateTaglineAndBio}
        />
      )}
    </main>
  );
}

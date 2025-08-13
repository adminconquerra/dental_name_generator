'use client';

import type { FormValues, GeneratedName } from '@/lib/types';
import { useState, useRef } from 'react';
import { generateDentalBusinessNames } from '@/ai/flows/generate-dental-business-names';
import { generateTaglineAndBio } from '@/ai/flows/generate-tagline-and-bio';
import { checkDomainAvailability } from '@/ai/flows/check-domain-availability';
import { DOMAIN_EXTENSIONS } from '@/lib/constants';

import Header from '@/components/dental-name-craft/Header';
import GeneratorForm from '@/components/dental-name-craft/GeneratorForm';
import ResultsView from '@/components/dental-name-craft/ResultsView';
import NameDetailsModal from '@/components/dental-name-craft/NameDetailsModal';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [formInput, setFormInput] = useState<FormValues | null>(null);
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<GeneratedName | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerateNames = async (data: FormValues, append = false) => {
    if (append) {
      setIsGeneratingMore(true);
    } else {
      setIsLoading(true);
      setGeneratedNames([]);
      setFormInput(data);
    }
    setError(null);

    try {
      const results = await generateDentalBusinessNames(data);
      const namesWithStatus = results.map(name => ({
        ...name,
        taglineStatus: 'idle',
        domainStatus: 'idle',
      }));

      if (append) {
        setGeneratedNames(prev => [...prev, ...namesWithStatus]);
      } else {
        setGeneratedNames(namesWithStatus);
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
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
      setIsGeneratingMore(false);
    }
  };

  const handleGenerateMore = () => {
    if (formInput) {
      handleGenerateNames(formInput, true);
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

  const handleCheckDomains = async (name: string) => {
    updateNameInState(name, { domainStatus: 'loading' });
    try {
        const results = await checkDomainAvailability({ name, extensions: DOMAIN_EXTENSIONS });
        // Create a map for easy lookup
        const availabilityMap = results.reduce((acc, item) => {
            acc[item.domain] = item.available;
            return acc;
        }, {} as Record<string, boolean>);
        updateNameInState(name, { domains: availabilityMap, domainStatus: 'done' });
    } catch (e) {
        updateNameInState(name, { domainStatus: 'error' });
        toast({ variant: 'destructive', title: 'Error', description: 'Could not check domain availability.' });
    }
  }


  const handleSelectName = (name: GeneratedName) => {
    setSelectedName(name);
    setIsModalOpen(true);
    if (name.taglineStatus === 'idle') {
      handleGenerateTaglineAndBio(name.name);
    }
    if (name.domainStatus === 'idle') {
      handleCheckDomains(name.name);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 font-body">
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        <section id="generator" className="w-full mt-8">
          <GeneratorForm onSubmit={(data) => handleGenerateNames(data, false)} isLoading={isLoading} />
        </section>
        <section id="results" ref={resultsRef} className="w-full mt-12 scroll-mt-20">
          <ResultsView
            names={generatedNames}
            isLoading={isLoading}
            isGeneratingMore={isGeneratingMore}
            onSelectName={handleSelectName}
            formInput={formInput}
            onGenerateMore={handleGenerateMore}
            updateNameInState={updateNameInState}
          />
        </section>
      </div>
      {selectedName && (
        <NameDetailsModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          nameData={selectedName}
          onGenerateTagline={handleGenerateTaglineAndBio}
        />
      )}
    </main>
  );
}

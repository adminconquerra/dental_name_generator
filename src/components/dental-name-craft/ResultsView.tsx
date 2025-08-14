'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { GeneratedName, FormValues } from '@/lib/types';
import NameCard from './NameCard';
import { Skeleton } from '@/components/ui/skeleton';
import TypewriterEffect from './TypewriterEffect';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { checkDomainAvailability } from '@/ai/flows/check-domain-availability';
import { DOMAIN_EXTENSIONS, COUNTRIES } from '@/lib/constants';

interface ResultsViewProps {
  names: GeneratedName[];
  isLoading: boolean;
  isGeneratingMore: boolean;
  onSelectName: (name: GeneratedName) => void;
  formInput: FormValues | null;
  onGenerateMore: () => void;
  updateNameInState: (name: string, updates: Partial<GeneratedName>) => void;
}

const ResultsView = ({ names, isLoading, isGeneratingMore, onSelectName, formInput, onGenerateMore, updateNameInState }: ResultsViewProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'score' | 'pronounceability' | 'length'>('score');

  useEffect(() => {
    // Only check domains for new names that haven't been checked
    const namesToCheck = names.filter(n => n.domainStatus === 'idle');
    
    if (namesToCheck.length > 0) {
      namesToCheck.forEach(name => {
        handleCheckDomains(name.name, formInput?.country);
      });
    }
  }, [names, formInput]);

  const handleCheckDomains = async (name: string, country?: string) => {
    updateNameInState(name, { domainStatus: 'loading' });
    let extensions = [...DOMAIN_EXTENSIONS];
    if (country) {
        const countryData = COUNTRIES.find(c => c.value === country);
        if (countryData && countryData.tld) {
            extensions.push(countryData.tld);
        }
    }

    try {
        const results = await checkDomainAvailability({ name, extensions });
        const availabilityMap = results.reduce((acc, item) => {
            acc[item.domain] = item.available;
            return acc;
        }, {} as Record<string, boolean>);
        updateNameInState(name, { domains: availabilityMap, domainStatus: 'done' });
    } catch (e) {
        updateNameInState(name, { domainStatus: 'error' });
    }
  }


  const handleToggleFavorite = (name: string) => {
    setFavorites(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };
  
  const filteredAndSortedNames = useMemo(() => {
    let namesToDisplay = [...names];

    if (formInput?.maxNameLength) {
        namesToDisplay = namesToDisplay.filter(
            (name) => name.name.length <= formInput.maxNameLength!
        );
    }

    return namesToDisplay.sort((a, b) => {
        if (sortOrder === 'score') {
            return b.totalNameScore - a.totalNameScore;
        }
        if (sortOrder === 'pronounceability') {
            return b.pronounceabilityScore - a.pronounceabilityScore;
        }
        if (sortOrder === 'length') {
            return a.name.length - b.name.length;
        }
        return 0;
    });
  }, [names, sortOrder, formInput]);


  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg bg-card">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="flex justify-between items-center pt-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (names.length === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-lg bg-card border border-dashed">
        <h2 className="font-headline text-3xl font-bold text-primary">Ready to Find Your Name?</h2>
        <p className="text-muted-foreground mt-2 text-lg">Your future brand starts here. Some ideas to get you started:</p>
        <div className="mt-6 text-xl text-foreground font-semibold">
          <TypewriterEffect
            texts={['Bright Smile Dental', 'Ortho Austin', 'Pearl Pediatric Dentistry']}
          />
        </div>
      </div>
    );
  }

  const getDomainExtensions = () => {
    let extensions = [...DOMAIN_EXTENSIONS];
    if (formInput?.country) {
      const countryData = COUNTRIES.find(c => c.value === formInput.country);
      if (countryData?.tld && !extensions.includes(countryData.tld)) {
        extensions.push(countryData.tld);
      }
    }
    return extensions;
  };
  const allDomainExtensions = getDomainExtensions();

  return (
    <div>
        <div className="flex flex-col items-start mb-6">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-3xl font-headline font-bold text-primary">
                  Generated Names
                  <Badge variant="secondary" className="ml-3 text-lg">{filteredAndSortedNames.length}</Badge>
              </h2>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                  <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="score">Sort by Total Score</SelectItem>
                      <SelectItem value="pronounceability">Sort by Pronounceability</SelectItem>
                      <SelectItem value="length">Sort by Name Length</SelectItem>
                  </SelectContent>
              </Select>
            </div>
            <p className="mt-2 text-muted-foreground max-w-3xl">
              We've crafted a unique set of names tailored to your practice. Each name includes a total score, pronounceability rating, and real-time domain availability checks to help you make the perfect choice.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedNames.map((name, index) => (
            <NameCard
              key={`${name.name}-${index}`}
              nameData={{...name, isFavorite: favorites.includes(name.name)}}
              onSelectName={onSelectName}
              onToggleFavorite={handleToggleFavorite}
              domainExtensions={allDomainExtensions}
            />
        ))}
        </div>
        <div className="flex justify-center mt-8">
            <Button onClick={onGenerateMore} size="lg" disabled={isGeneratingMore} className="font-bold text-lg">
                {isGeneratingMore ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate More
                    </>
                )}
            </Button>
        </div>
    </div>
  );
};

export default ResultsView;

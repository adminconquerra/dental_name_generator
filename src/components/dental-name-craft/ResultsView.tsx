'use client';

import React, { useState, useEffect } from 'react';
import type { GeneratedName } from '@/lib/types';
import NameCard from './NameCard';
import { Skeleton } from '@/components/ui/skeleton';
import TypewriterEffect from './TypewriterEffect';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { checkDomainAvailability } from '@/ai/flows/check-domain-availability';
import { DOMAIN_EXTENSIONS } from '@/lib/constants';

interface ResultsViewProps {
  names: GeneratedName[];
  isLoading: boolean;
  onSelectName: (name: GeneratedName) => void;
}

const ResultsView = ({ names, isLoading, onSelectName }: ResultsViewProps) => {
  const [internalNames, setInternalNames] = useState<GeneratedName[]>(names);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'score' | 'pronounceability'>('score');

  useEffect(() => {
    setInternalNames(names);
    // When new names are generated, kick off domain checks for all of them
    if (names.length > 0) {
      names.forEach(name => {
        if (name.domainStatus === 'idle') {
          handleCheckDomains(name.name);
        }
      });
    }
  }, [names]);

  const updateNameInState = (name: string, updates: Partial<GeneratedName>) => {
    setInternalNames(prev =>
      prev.map(item => (item.name === name ? { ...item, ...updates } : item))
    );
  };

  const handleCheckDomains = async (name: string) => {
    updateNameInState(name, { domainStatus: 'loading' });
    try {
        const results = await checkDomainAvailability({ name, extensions: DOMAIN_EXTENSIONS });
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
  
  const sortedNames = [...internalNames].sort((a, b) => {
    if (sortOrder === 'score') {
      return b.totalNameScore - a.totalNameScore;
    }
    return b.pronounceabilityScore - a.pronounceabilityScore;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
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

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-headline font-bold text-primary">
                Generated Names
                <Badge variant="secondary" className="ml-3 text-lg">{names.length}</Badge>
            </h2>
            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="score">Sort by Total Score</SelectItem>
                    <SelectItem value="pronounceability">Sort by Pronounceability</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNames.map(name => (
            <NameCard
              key={name.name}
              nameData={{...name, isFavorite: favorites.includes(name.name)}}
              onSelectName={onSelectName}
              onToggleFavorite={handleToggleFavorite}
            />
        ))}
        </div>
    </div>
  );
};

export default ResultsView;

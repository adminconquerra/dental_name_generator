'use client';

import type { GeneratedName } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DOMAIN_EXTENSIONS } from '@/lib/constants';
import { Skeleton } from '../ui/skeleton';

interface NameCardProps {
  nameData: GeneratedName;
  onSelectName: (name: GeneratedName) => void;
  onToggleFavorite: (name: string) => void;
}

const NameCard = ({ nameData, onSelectName, onToggleFavorite }: NameCardProps) => {

  return (
    <Card className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl text-primary">{nameData.name}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(nameData.name);
                  }}
                >
                  <Heart className={nameData.isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{nameData.isFavorite ? 'Remove from favorites' : 'Add to favorites'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="italic">"{nameData.rationale}"</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">Total Score</span>
            <span className="text-sm font-bold text-primary">{nameData.totalNameScore}/100</span>
          </div>
          <Progress value={nameData.totalNameScore} />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-foreground">Pronounceability</span>
            <span className="text-sm font-bold text-primary">{nameData.pronounceabilityScore}/10</span>
          </div>
          <Progress value={nameData.pronounceabilityScore * 10} />
        </div>
        <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Domain Availability</h4>
            <div className="flex items-center gap-4">
                {nameData.domainStatus === 'loading' && <Skeleton className="h-5 w-full" />}
                {nameData.domainStatus === 'error' && <p className="text-xs text-destructive">Could not check domains.</p>}
                {(nameData.domainStatus === 'idle' || !nameData.domains) && <p className="text-xs text-muted-foreground">Click "See Details" to check.</p>}
                {nameData.domainStatus === 'done' && nameData.domains && DOMAIN_EXTENSIONS.map(ext => {
                    const domainName = nameData.name.replace(/\s+/g, '').toLowerCase() + ext;
                    const isAvailable = nameData.domains![domainName];
                    return (
                        <TooltipProvider key={ext}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        {isAvailable ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                                        <span>{ext}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{domainName} is {isAvailable ? 'available' : 'unavailable'}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )
                })}
            </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onSelectName(nameData)} className="w-full">See Details</Button>
      </CardFooter>
    </Card>
  );
};

export default NameCard;

'use client';

import type { GeneratedName } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ClipboardCopy, Loader2, Twitter, Bot, FileText, Palette, Type, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';
import { DOMAIN_EXTENSIONS, COUNTRIES } from '@/lib/constants';

interface NameDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  nameData: GeneratedName | null;
  onGenerateTagline: (name: string) => void;
  country?: string;
}

const NameDetailsModal = ({
  isOpen,
  onOpenChange,
  nameData,
  onGenerateTagline,
  country
}: NameDetailsModalProps) => {
  const { toast } = useToast();

  if (!nameData) return null;
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} Copied!`,
      description: text,
    });
  };

  const { brandKit, seo } = nameData;

  const getDomainExtensions = () => {
    let extensions = [...DOMAIN_EXTENSIONS];
    if (country) {
      const countryData = COUNTRIES.find(c => c.value === country);
      if (countryData?.tld && !extensions.includes(countryData.tld)) {
        extensions.push(countryData.tld);
      }
    }
    return extensions;
  };

  const allDomainExtensions = getDomainExtensions();

  const affiliateId = process.env.NAMECHEAP_AFFILIATE_ID;

  const getAffiliateLink = (domain: string) => {
    if (!affiliateId) return `https://www.namecheap.com/domains/registration/results/?domain=${domain}`;
    return `https://www.namecheap.com/domains/registration/results/?domain=${domain}&affId=${affiliateId}`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-primary">{nameData.name}</DialogTitle>
          <DialogDescription className="italic text-base">"{nameData.rationale}"</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full pr-6 -mr-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
          <div className="space-y-6">
            {/* Tagline & Bio Section */}
            <div>
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><Bot className="text-primary"/> AI-Generated Copy</h3>
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                 {nameData.taglineStatus === 'loading' && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/>Generating copy...</div>}
                 {nameData.taglineStatus === 'error' && <p className="text-destructive">Could not load copy.</p>}
                 {nameData.taglineStatus === 'done' && nameData.taglineAndBio && (
                    <>
                        <div className="space-y-1">
                            <h4 className="font-semibold text-sm">Tagline</h4>
                            <div className="flex items-center justify-between">
                                <p className="text-foreground italic">"{nameData.taglineAndBio.tagline}"</p>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(nameData.taglineAndBio!.tagline, 'Tagline')}><ClipboardCopy className="h-4 w-4" /></Button>
                            </div>
                        </div>
                         <div className="space-y-1">
                            <h4 className="font-semibold text-sm flex items-center gap-2"><Twitter className="h-4 w-4"/> Social Media Bio</h4>
                            <div className="flex items-center justify-between">
                                <p className="text-foreground">{nameData.taglineAndBio.socialMediaBio}</p>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(nameData.taglineAndBio!.socialMediaBio, 'Bio')}><ClipboardCopy className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </>
                 )}
                 {(nameData.taglineStatus === 'idle' || nameData.taglineStatus === 'error') && (
                    <Button onClick={() => onGenerateTagline(nameData.name)} variant="link">Generate Tagline & Bio</Button>
                 )}
              </div>
            </div>
             {/* Brand Kit Section */}
             <div className="p-4 bg-card rounded-lg">
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><Palette className="text-primary"/> Brand Kit</h3>
               <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Type className="h-5 w-5 text-muted-foreground"/>
                        <span className="font-semibold">Fonts</span>
                      </div>
                       <div className="text-right">
                           <p className="font-medium">{brandKit.headingFont} (Headings)</p>
                           <p className="font-medium">{brandKit.bodyFont} (Body)</p>
                       </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-muted-foreground"/>
                        <span className="font-semibold">Colors</span>
                      </div>
                       <div className="flex gap-2">
                           <div className="h-6 w-6 rounded-full border" title={brandKit.colorPalette.primary} style={{ backgroundColor: brandKit.colorPalette.primary }} />
                           <div className="h-6 w-6 rounded-full border" title={brandKit.colorPalette.accent} style={{ backgroundColor: brandKit.colorPalette.accent }} />
                           <div className="h-6 w-6 rounded-full border" title={brandKit.colorPalette.background} style={{ backgroundColor: brandKit.colorPalette.background }}/>
                           <div className="h-6 w-6 rounded-full border" title={brandKit.colorPalette.foreground} style={{ backgroundColor: brandKit.colorPalette.foreground }} />
                       </div>
                   </div>
               </div>
            </div>
          </div>
            
          <div className="space-y-6">
            {/* Availability Section */}
            <div>
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="text-primary"/> Availability</h3>
               <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-semibold">Domain Suggestions</p>
                {nameData.domainStatus === 'loading' && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/>Checking domains...</div>}
                {nameData.domainStatus === 'error' && <p className="text-destructive text-sm">Could not check domains.</p>}
                {nameData.domainStatus === 'done' && nameData.domains && (
                     <ul className="space-y-2">
                        {allDomainExtensions.map(ext => {
                            const domain = nameData.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() + ext;
                            const isAvailable = nameData.domains![domain];
                            return (
                                <li key={ext} className='flex items-center justify-between'>
                                    <span className={isAvailable ? 'text-green-600' : 'text-red-600'}>{domain}</span>
                                    {isAvailable ? (
                                        <Button asChild size="sm" variant="secondary">
                                            <a href={getAffiliateLink(domain)} target="_blank" rel="noopener noreferrer">
                                                Buy <ExternalLink className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    ) : (
                                        <Badge variant='destructive'>Taken</Badge>
                                    )}
                                </li>
                            )
                        })}
                     </ul>
                )}
              </div>
            </div>
            {/* SEO Section */}
            <div>
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><FileText className="text-primary"/> SEO Preview</h3>
               <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-1">
                        <h4 className="font-semibold text-sm">Title Tag</h4>
                        <p className="text-sm text-foreground/80 p-2 bg-background rounded">{seo.title}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(seo.title, 'Title')}><ClipboardCopy className="h-4 w-4" /></Button>
                    </div>
                     <div className="space-y-1">
                        <h4 className="font-semibold text-sm">Meta Description</h4>
                        <p className="text-sm text-foreground/80 p-2 bg-background rounded">{seo.description}</p>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(seo.description, 'Description')}><ClipboardCopy className="h-4 w-4" /></Button>
                    </div>
               </div>
            </div>
          </div>
        </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NameDetailsModal;

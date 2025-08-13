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
import { CheckCircle2, ClipboardCopy, Download, Image as ImageIcon, Loader2, Twitter, Bot, FileText, Palette, Type } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '../ui/scroll-area';

interface NameDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  nameData: GeneratedName | null;
  onGenerateLogo: (name: string) => void;
  onGenerateTagline: (name: string) => void;
}

const NameDetailsModal = ({
  isOpen,
  onOpenChange,
  nameData,
  onGenerateLogo,
  onGenerateTagline,
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

  const downloadLogo = () => {
    if (nameData.logoDataUri) {
        const link = document.createElement('a');
        link.href = nameData.logoDataUri;
        const sanitizedName = nameData.name.replace(/\s+/g, '_').toLowerCase();
        link.download = `${sanitizedName}_logo.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Logo download started!' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh]">
        <ScrollArea className="h-full pr-6">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-primary">{nameData.name}</DialogTitle>
          <DialogDescription className="italic text-base">"{nameData.rationale}"</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
          <div className="space-y-6">
            {/* Logo Section */}
            <div>
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><ImageIcon className="text-primary"/> Logo Mockup</h3>
              <div className="aspect-square border rounded-lg flex items-center justify-center bg-muted/50 p-4">
                {nameData.logoStatus === 'loading' && <Loader2 className="h-10 w-10 animate-spin text-primary" />}
                {nameData.logoStatus === 'error' && <p className="text-destructive">Error generating logo.</p>}
                {nameData.logoStatus === 'done' && nameData.logoDataUri && (
                  <Image src={nameData.logoDataUri} alt={`${nameData.name} logo`} width={400} height={400} className="rounded-md" />
                )}
                {(nameData.logoStatus === 'idle' || nameData.logoStatus === 'error') && (
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">Generate an AI logo for your brand.</p>
                    <Button onClick={() => onGenerateLogo(nameData.name)}>
                      Generate Logo
                    </Button>
                  </div>
                )}
              </div>
               {nameData.logoStatus === 'done' && nameData.logoDataUri && (
                <Button onClick={downloadLogo} className="w-full mt-2" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download Logo
                </Button>
               )}
            </div>

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
                            <p className="text-foreground italic">"{nameData.taglineAndBio.tagline}"</p>
                             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(nameData.taglineAndBio!.tagline, 'Tagline')}><ClipboardCopy className="h-4 w-4" /></Button>
                        </div>
                         <div className="space-y-1">
                            <h4 className="font-semibold text-sm flex items-center gap-2"><Twitter className="h-4 w-4"/> Social Media Bio</h4>
                            <p className="text-foreground">{nameData.taglineAndBio.socialMediaBio}</p>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(nameData.taglineAndBio!.socialMediaBio, 'Bio')}><ClipboardCopy className="h-4 w-4" /></Button>
                        </div>
                    </>
                 )}
                 {(nameData.taglineStatus === 'idle' || nameData.taglineStatus === 'error') && (
                    <Button onClick={() => onGenerateTagline(nameData.name)} variant="link">Generate Tagline & Bio</Button>
                 )}
              </div>
            </div>
          </div>
            
          <div className="space-y-6">
            {/* Brand Kit Section */}
            <div>
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><Download className="text-primary"/> Brand Kit</h3>
               <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Type className="h-5 w-5 text-muted-foreground"/>
                        <span className="font-semibold">Fonts</span>
                      </div>
                       <div className="text-right">
                           <p className="font-medium">Poppins (Headings)</p>
                           <p className="font-medium">Inter (Body)</p>
                       </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Palette className="h-5 w-5 text-muted-foreground"/>
                        <span className="font-semibold">Colors</span>
                      </div>
                       <div className="flex gap-2">
                           <div className="h-6 w-6 rounded-full bg-primary border" title="#3870A4" />
                           <div className="h-6 w-6 rounded-full bg-accent border" title="#A7E0DD" />
                           <div className="h-6 w-6 rounded-full bg-background border" title="#F0F2F5"/>
                           <div className="h-6 w-6 rounded-full bg-foreground border" title="#2d3748" />
                       </div>
                   </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-3"><FileText className="h-5 w-5 text-muted-foreground"/> SEO Meta</h4>
                        <p className="text-sm text-foreground/80 p-2 bg-background rounded"><strong>Title:</strong> {nameData.name} | Your Location | Quality Dental Care</p>
                        <p className="text-sm text-foreground/80 p-2 bg-background rounded"><strong>Desc:</strong> Discover top-tier dental services at {nameData.name}. We offer a wide range of treatments for the whole family. Book your appointment today!</p>
                    </div>
               </div>
            </div>

            {/* Availability Section */}
            <div>
              <h3 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="text-primary"/> Availability</h3>
               <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <p className="text-sm font-semibold">Domain Suggestions</p>
                 <ul className="space-y-2">
                    <li className="flex items-center justify-between text-green-600">.com <Badge variant="secondary">Available</Badge></li>
                    <li className="flex items-center justify-between text-green-600">.clinic <Badge variant="secondary">Available</Badge></li>
                    <li className="flex items-center justify-between text-red-600">.dentist <Badge variant="destructive">Taken</Badge></li>
                 </ul>
                 <p className="text-sm font-semibold mt-4">Social Handles</p>
                 <ul className="space-y-2">
                    <li className="flex items-center justify-between text-green-600">Twitter <Badge variant="secondary">Available</Badge></li>
                    <li className="flex items-center justify-between text-green-600">Instagram <Badge variant="secondary">Available</Badge></li>
                    <li className="flex items-center justify-between text-red-600">Facebook <Badge variant="destructive">Taken</Badge></li>
                 </ul>
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

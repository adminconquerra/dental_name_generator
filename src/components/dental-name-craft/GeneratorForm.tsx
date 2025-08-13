'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { TARGET_AUDIENCES, BRAND_PERSONALITIES, PRACTICE_TYPES } from '@/lib/constants';
import type { FormValues } from '@/lib/types';
import { Slider } from '../ui/slider';

const formSchema = z.object({
  practiceType: z.string().min(1, 'Please select a practice type.'),
  location: z.string().min(2, 'Location must be at least 2 characters.'),
  targetAudience: z.array(z.string()).min(1, 'Select at least one target audience.'),
  brandPersonality: z.array(z.string()).min(1, 'Select at least one brand personality.'),
  mustIncludeWords: z.string().optional(),
  wordsToAvoid: z.string().optional(),
  maxNameLength: z.coerce.number().positive().optional(),
  includeOwnerName: z.boolean().optional(),
  ownerName: z.string().optional(),
}).refine(data => !data.includeOwnerName || !!data.ownerName, {
  message: 'Owner name is required if toggled on.',
  path: ['ownerName'],
});

interface GeneratorFormProps {
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
}

const GeneratorForm = ({ onSubmit, isLoading }: GeneratorFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      practiceType: 'General',
      location: '',
      targetAudience: [],
      brandPersonality: [],
      mustIncludeWords: '',
      wordsToAvoid: '',
      maxNameLength: 30,
      includeOwnerName: false,
      ownerName: '',
    },
  });

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
          <Wand2 />
          Create Your Brand
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="practiceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Practice Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a practice type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRACTICE_TYPES.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (City or Suburb)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Melbourne" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={() => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {TARGET_AUDIENCES.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="targetAudience"
                            render={({ field }) => (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.label)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.label])
                                        : field.onChange(field.value?.filter((value) => value !== item.label));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandPersonality"
                  render={() => (
                    <FormItem>
                      <FormLabel>Brand Personality</FormLabel>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {BRAND_PERSONALITIES.map((item) => (
                          <FormField
                            key={item.id}
                            control={form.control}
                            name="brandPersonality"
                            render={({ field }) => (
                              <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.label)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.label])
                                        : field.onChange(field.value?.filter((value) => value !== item.label));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{item.label}</FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="mustIncludeWords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Must-Include Words</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Smile, Bright" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated words.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="wordsToAvoid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Words to Avoid</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Pain, Cheap" {...field} />
                    </FormControl>
                    <FormDescription>Comma-separated words.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
                control={form.control}
                name="maxNameLength"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Max Name Length: <span className="text-primary font-bold">{field.value}</span> characters</FormLabel>
                        <FormControl>
                            <Slider
                                min={10}
                                max={50}
                                step={1}
                                value={[field.value || 30]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <FormField
                  control={form.control}
                  name="includeOwnerName"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel>Include Owner Name?</FormLabel>
                        <FormDescription>e.g., "Dr. Steve Dental"</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.watch('includeOwnerName') && (
                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Owner Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Dr. Patel" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
            </div>

            <div className="flex justify-center pt-4">
                <Button type="submit" size="lg" disabled={isLoading} className="w-full max-w-md font-bold text-lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Brushing up some names...
                    </>
                  ) : (
                    <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Find My Perfect Name
                    </>
                  )}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GeneratorForm;

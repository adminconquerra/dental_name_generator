'use client';

import { Star, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: "Dr. Aisha Khan",
    reviewBody: "Saved us weeks of brainstorming. Instantly found a memorable clinic name and a matching .com domain. Brand kit suggestions were spot-on.",
    rating: 5,
    avatar: 'AK',
  },
  {
    name: "Michael R.",
    reviewBody: "Fast and useful — loved the country TLD check feature for our multi-location clinic expansion.",
    rating: 4,
    avatar: 'MR',
  },
  {
    name: "Smile Studio",
    verified: true,
    reviewBody: "Great free tool. The logo prompts made our designer's job easier and we secured the domain within minutes.",
    rating: 5,
    avatar: 'SS',
  },
];

const Testimonials = () => {
  return (
    <div className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-headline font-bold text-primary">
            Trusted by Dental Professionals
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            See why clinic owners and managers love our tool.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col bg-card hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg font-semibold text-foreground">{testimonial.name}</CardTitle>
                    {testimonial.verified && (
                      <div className="flex items-center text-xs text-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified Owner
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-muted-foreground italic">"{testimonial.reviewBody}"</p>
                <div className="flex items-center mt-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

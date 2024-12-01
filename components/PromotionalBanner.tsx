'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Trophy, Zap } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const promotions = [
  {
    title: 'Welcome Bonus',
    description: 'Get 100% bonus up to $500 on your first deposit!',
    icon: Gift,
  },
  {
    title: 'Weekly Cashback',
    description: 'Enjoy 10% cashback on your weekly losses!',
    icon: Trophy,
  },
  {
    title: 'Enhanced Odds',
    description: 'Get boosted odds on selected matches every day!',
    icon: Zap,
  },
];

export default function PromotionalBanner() {
  const [activePromo, setActivePromo] = useState(0);

  return (
    <div className="w-full mb-8">
      <Carousel
        className="w-full max-w-5xl mx-auto"
        onSelect={(index) => setActivePromo(index)}
      >
        <CarouselContent>
          {promotions.map((promo, index) => {
            const Icon = promo.icon;
            return (
              <CarouselItem key={index}>
                <Card className="promotion-card">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 rounded-full bg-white/10">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {promo.title}
                        </h3>
                        <p className="text-white/80">{promo.description}</p>
                      </div>
                      <Button variant="secondary" className="whitespace-nowrap">
                        Claim Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
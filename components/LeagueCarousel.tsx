'use client';

import { useEffect, useState } from 'react';
import { League } from '@/lib/types';
import { getLeagues } from '@/lib/api';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface LeagueCarouselProps {
  onLeagueSelect: (leagueId: string) => void;
}

export default function LeagueCarousel({ onLeagueSelect }: LeagueCarouselProps) {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLeagues();
        console.log('Leagues data in component:', data); // Debug log
        if (Array.isArray(data) && data.length > 0) {
          setLeagues(data);
          // Select the first league by default
          onLeagueSelect(data[0].idLeague);
        } else {
          setError('No leagues available');
        }
      } catch (err) {
        console.error('Error in LeagueCarousel:', err); // Debug log
        setError('Failed to load leagues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeagues();
  }, [onLeagueSelect]);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (leagues.length === 0) {
    return (
      <Alert>
        <AlertDescription>No leagues available at the moment.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Carousel className="w-full max-w-5xl mx-auto">
      <CarouselContent>
        {leagues.map((league) => (
          <CarouselItem key={league.idLeague} className="md:basis-1/3 lg:basis-1/4">
            <Card
              className="cursor-pointer hover:scale-105 transition-transform"
              onClick={() => onLeagueSelect(league.idLeague)}
            >
              <CardContent className="flex items-center justify-center p-6">
                <h3 className="text-lg font-semibold text-center">{league.strLeague}</h3>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
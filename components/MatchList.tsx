'use client';

import { useEffect, useState } from 'react';
import { Match } from '@/lib/types';
import { getUpcomingMatches } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useBetting } from '@/lib/hooks/useBetting';
import Image from 'next/image';

interface MatchListProps {
  leagueId: string;
}

export default function MatchList({ leagueId }: MatchListProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addBet } = useBetting();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUpcomingMatches(leagueId);
        setMatches(data);
      } catch (err) {
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [leagueId]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-64" />
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

  if (matches.length === 0) {
    return (
      <Alert>
        <AlertDescription>No matches available for this league.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {matches.map((match) => (
        <Card key={match.idEvent} className="overflow-hidden">
          <CardHeader className="relative h-48">
            <Image
              src={match.strThumb || '/placeholder.jpg'}
              alt={match.strEvent}
              fill
              className="object-cover"
            />
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Image
                  src={match.strHomeTeamBadge}
                  alt={match.strHomeTeam}
                  width={30}
                  height={30}
                />
                <span>{match.strHomeTeam}</span>
              </div>
              <span>vs</span>
              <div className="flex items-center space-x-2">
                <span>{match.strAwayTeam}</span>
                <Image
                  src={match.strAwayTeamBadge}
                  alt={match.strAwayTeam}
                  width={30}
                  height={30}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Button
                variant="outline"
                className="flex flex-col"
                onClick={() => addBet(match, 'home')}
              >
                <span>Home</span>
                <Badge variant="secondary">{match.homeOdds}</Badge>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col"
                onClick={() => addBet(match, 'draw')}
              >
                <span>Draw</span>
                <Badge variant="secondary">{match.drawOdds}</Badge>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col"
                onClick={() => addBet(match, 'away')}
              >
                <span>Away</span>
                <Badge variant="secondary">{match.awayOdds}</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
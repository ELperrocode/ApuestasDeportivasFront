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
import MatchSearch from '@/components/MatchSearch';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MatchListProps {
  leagueId: string;
}

export default function MatchList({ leagueId }: MatchListProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addBet } = useBetting();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const matchesPerPage = 10;

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUpcomingMatches(leagueId);
        setMatches(data);
        setFilteredMatches(data);
        setCurrentPage(1);
      } catch (err) {
        setError('Failed to load matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [leagueId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    if (!query.trim()) {
      setFilteredMatches(matches);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = matches.filter(match => 
      match.strHomeTeam.toLowerCase().includes(searchTerm) ||
      match.strAwayTeam.toLowerCase().includes(searchTerm)
    );
    setFilteredMatches(filtered);
  };

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

  // Pagination calculations
  const indexOfLastMatch = currentPage * matchesPerPage;
  const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
  const currentMatches = filteredMatches.slice(indexOfFirstMatch, indexOfLastMatch);
  const totalPages = Math.ceil(filteredMatches.length / matchesPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8">
      <MatchSearch onSearch={handleSearch} />
      
      {filteredMatches.length === 0 ? (
        <Alert>
          <AlertDescription>No matches found for "{searchQuery}"</AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentMatches.map((match) => (
              <Card key={match.idEvent} className="overflow-hidden hover:shadow-xl transition-all">
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
                      className="flex flex-col hover:bg-primary hover:text-primary-foreground"
                      onClick={() => addBet(match, 'home')}
                    >
                      <span>Home</span>
                      <Badge variant="secondary">{match.homeOdds}</Badge>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col hover:bg-primary hover:text-primary-foreground"
                      onClick={() => addBet(match, 'draw')}
                    >
                      <span>Draw</span>
                      <Badge variant="secondary">{match.drawOdds}</Badge>
                    </Button>
                    <Button
                      variant="outline"
                      className="flex flex-col hover:bg-primary hover:text-primary-foreground"
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

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    onClick={() => paginate(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
}
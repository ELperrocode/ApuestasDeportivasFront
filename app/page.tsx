'use client';

import { useState } from 'react';
import LeagueCarousel from '@/components/LeagueCarousel';
import MatchList from '@/components/MatchList';
import BetSlip from '@/components/BetSlip';
import UserBets from '@/components/UserBets';
import AuthDialog from '@/components/AuthDialog';
import PromotionalBanner from '@/components/PromotionalBanner';
import { Match } from '@/lib/types';
import { DollarSign, Trophy, Users } from 'lucide-react';

export default function Home() {
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold gradient-text">ElperroBets</h1>
          <AuthDialog />
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <PromotionalBanner />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="glass-card p-6 rounded-lg flex items-center space-x-4">
            <DollarSign className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Best Odds</h3>
              <p className="text-sm text-muted-foreground">Competitive pricing</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-lg flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Daily Rewards</h3>
              <p className="text-sm text-muted-foreground">Win extra bonuses</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-lg flex items-center space-x-4">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Community</h3>
              <p className="text-sm text-muted-foreground">Join other bettors</p>
            </div>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 gradient-text">Popular Leagues</h2>
          <LeagueCarousel onLeagueSelect={setSelectedLeague} />
        </section>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <section>
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Upcoming Matches</h2>
              {selectedLeague && (
                <MatchList
                  leagueId={selectedLeague}
                  onMatchSelect={setSelectedMatch}
                />
              )}
            </section>
          </div>
          
          <div className="space-y-8">
            <div className="glass-card p-6 rounded-lg">
              <BetSlip match={selectedMatch} />
            </div>
            <div className="glass-card p-6 rounded-lg">
              <UserBets />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
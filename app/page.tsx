'use client';

import { useState } from 'react';
import LeagueCarousel from '@/components/LeagueCarousel';
import MatchList from '@/components/MatchList';
import BettingSidebar from '@/components/BettingSidebar';
import AuthDialog from '@/components/AuthDialog';
import UserWallet from '@/components/UserWallet';
import PromotionalBanner from '@/components/PromotionalBanner';
import { DollarSign, Trophy, Users } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import ProfileCard from "@/components/ProfileCard";

const ProfileGrid: React.FC = () => {
  const profiles = [
    {
      image: "/images/icono-ruben.jpg",
      name: "Ruben Rivera",
      description: "Hola",
      id: "8-1003-856",
    },
    {
      image: "/images/icono-henry.jpg",
      name: "Henry Maldonado",
      description: "El perro",
      id: "8-997-1177",
    },
    {
      image: "/images/icono-michael.jpg",
      name: "Michael Aparicio",
      description: "No confíen, es de la 24",
      id: "8-1011-1944",
    },
    {
      image: "/images/icono-javier.jpg",
      name: "Javier Hernandez",
      description: "Yo",
      id: "8-1001-178",
    },
  ];

  return (
    
    <div className="flex flex-center gap-4 justify-center mb-8">
      {profiles.map((profile, index) => (
        <ProfileCard
          key={index}
          image={profile.image}
          name={profile.name}
          description={profile.description}
          id={profile.id}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const [selectedLeague, setSelectedLeague] = useState<string>('');
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <nav className="border-b border-border/40 backdrop-blur-sm fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-4xl font-bold gradient-text">ELPERROBETS</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                <span>Welcome, {user.username}</span>
                <UserWallet />
              </>
            )}
            <AuthDialog />
            <BettingSidebar />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-24 pb-12">
        <PromotionalBanner />

        <h2 className="text-2xl font-semibold mb-4 gradient-text">Our Team</h2>
        <ProfileGrid />

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 gradient-text">Popular Leagues</h2>
          <LeagueCarousel onLeagueSelect={setSelectedLeague} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 gradient-text">Upcoming Matches</h2>
          {selectedLeague && <MatchList leagueId={selectedLeague} />}
        </section>
      </div>
    </main>
  );
}
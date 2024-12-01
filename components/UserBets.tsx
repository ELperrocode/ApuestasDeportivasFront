'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBetting } from '@/lib/hooks/useBetting';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

export default function UserBets() {
  const { user } = useAuth();
  const { userBets, loading, error, fetchUserBets, validateBet } = useBetting();

  useEffect(() => {
    if (user) {
      fetchUserBets(user.id);
    }
  }, [user, fetchUserBets]);

  if (!user) {
    return null;
  }

  if (loading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'win':
        return 'success';
      case 'lost':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Your Bets</h2>
      {userBets.length === 0 ? (
        <p>No bets placed yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userBets.map((bet) => (
            <Card key={bet.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{bet.type.toUpperCase()} Bet</span>
                  <Badge variant={getBadgeVariant(bet.status)}>
                    {bet.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Amount: ${bet.amount}</p>
                  <p>Odds: {bet.odds}</p>
                  <p>Potential Win: ${bet.potential}</p>
                  <p>Date: {new Date(bet.date).toLocaleDateString()}</p>
                  {bet.status === 'pending' && (
                    <Button
                      onClick={() => validateBet(bet.id)}
                      disabled={loading}
                    >
                      Validate Bet
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
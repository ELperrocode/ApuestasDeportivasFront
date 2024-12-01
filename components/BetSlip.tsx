'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBetting } from '@/lib/hooks/useBetting';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';

interface BetSlipProps {
  onSuccess?: () => void;
}

export default function BetSlip({ onSuccess }: BetSlipProps) {
  const [amount, setAmount] = useState('');
  const { user } = useAuth();
  const { selectedBets, removeBet, clearBets, placeBet, loading, error } = useBetting();

  const totalOdds = selectedBets.reduce((acc, bet) => acc * bet.odds, 1);
  const potentialWin = amount ? Number(amount) * totalOdds : 0;

  const handlePlaceBet = async () => {
    if (!user || !amount) return;
    
    if (Number(amount) > user.wallet) {
      alert('Insufficient funds in wallet');
      return;
    }

    await placeBet(user.id, Number(amount));
    if (!error) {
      setAmount('');
      onSuccess?.();
    }
  };

  if (!user) {
    return (
      <Alert>
        <AlertDescription>Please login to place bets</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {selectedBets.map((bet) => (
        <Card key={`${bet.matchId}-${bet.selection}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {bet.match.strEvent}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeBet(bet.matchId, bet.selection)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {bet.selection}
              </span>
              <Badge variant="secondary">Odds: {bet.odds}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedBets.length > 0 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Type:</span>
              <span>{selectedBets.length === 1 ? 'Simple' : 'Parlay'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total Odds:</span>
              <span>{totalOdds.toFixed(2)}</span>
            </div>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter bet amount"
              min="1"
              max={user.wallet}
            />
            {amount && (
              <div className="flex justify-between text-sm font-medium">
                <span>Potential Win:</span>
                <span>${potentialWin.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handlePlaceBet}
              disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > user.wallet}
              className="flex-1"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Place Bet
            </Button>
            <Button variant="outline" onClick={clearBets} disabled={loading}>
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
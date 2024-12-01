'use client';

import { useState } from 'react';
import { Match } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBetting } from '@/lib/hooks/useBetting';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, X } from 'lucide-react';

interface BetSlipProps {
  match: Match | null;
}

export default function BetSlip({ match }: BetSlipProps) {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const {
    selectedMatches,
    addMatch,
    removeMatch,
    clearMatches,
    placeBet: placeBetAction,
    loading,
    error,
  } = useBetting();

  const handleAddMatch = () => {
    if (match && !selectedMatches.find((m) => m.idEvent === match.idEvent)) {
      addMatch(match);
      setIsOpen(true);
    }
  };

  const handlePlaceBet = async () => {
    if (!user || !amount) return;
    await placeBetAction(user.id, Number(amount));
    if (!error) {
      setAmount('');
      setIsOpen(false);
    }
  };

  const totalOdds = selectedMatches.reduce((acc, match) => acc * match.odds, 1);
  const potentialWin = amount ? Number(amount) * totalOdds : 0;

  return (
    <>
      <Button onClick={handleAddMatch} disabled={!match || !user}>
        {!user ? 'Login to Bet' : 'Add to Bet Slip'}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Bet Slip</SheetTitle>
          </SheetHeader>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4 space-y-4">
            {selectedMatches.map((match) => (
              <div
                key={match.idEvent}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div>
                  <p className="font-medium">{match.strEvent}</p>
                  <Badge variant="secondary">Odds: {match.odds}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMatch(match.idEvent)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {selectedMatches.length > 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Bet Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <div className="space-y-2">
                  <p>Total Odds: {totalOdds.toFixed(2)}</p>
                  <p>Potential Win: ${potentialWin.toFixed(2)}</p>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={handlePlaceBet}
                    disabled={loading || !amount || Number(amount) <= 0}
                    className="flex-1"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Place Bet
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearMatches}
                    disabled={loading}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
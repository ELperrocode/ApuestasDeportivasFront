'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wallet } from 'lucide-react';
import { rechargeWallet, getUserBalance } from '@/lib/api';

export default function UserWallet() {
  const { user, updateUserBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleRecharge = async () => {
    if (!user || !amount) return;
    
    try {
      setLoading(true);
      setError(null);
      await rechargeWallet({ userId: user.id, amount: Number(amount) });
      const balance = await getUserBalance(user.id);
      updateUserBalance(balance);
      setAmount('');
      setOpen(false);
    } catch (err) {
      setError('Failed to recharge wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <Wallet className="h-4 w-4" />
        <span>${user.wallet}</span>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Recharge
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recharge Wallet</DialogTitle>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
            />
            <Button
              onClick={handleRecharge}
              disabled={loading || !amount || Number(amount) <= 0}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Recharge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
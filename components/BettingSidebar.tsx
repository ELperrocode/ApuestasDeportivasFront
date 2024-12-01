'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MenuIcon } from 'lucide-react';
import { useBetting } from '@/lib/hooks/useBetting';
import BetSlip from './BetSlip';
import UserBets from './UserBets';

export default function BettingSidebar() {
  const [open, setOpen] = useState(false);
  const { selectedBets } = useBetting();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <MenuIcon className="h-4 w-4" />
          {selectedBets.length > 0 && (
            <Badge 
              variant="default" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {selectedBets.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <Tabs defaultValue="current" className="w-full h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current">Current Bet</TabsTrigger>
            <TabsTrigger value="history">My Bets</TabsTrigger>
          </TabsList>
          <div className="mt-4 h-[calc(100vh-8rem)] overflow-y-auto">
            <TabsContent value="current" className="m-0">
              <BetSlip onSuccess={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="history" className="m-0">
              <UserBets />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
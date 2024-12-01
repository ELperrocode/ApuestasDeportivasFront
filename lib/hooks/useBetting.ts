'use client';

import { create } from 'zustand';
import { Match, Bet } from '@/lib/types';
import { placeBet, getUserBets, validateBet } from '@/lib/api';

interface BettingState {
  selectedMatches: Match[];
  userBets: Bet[];
  loading: boolean;
  error: string | null;
  addMatch: (match: Match) => void;
  removeMatch: (matchId: string) => void;
  clearMatches: () => void;
  placeBet: (userId: number, amount: number) => Promise<void>;
  fetchUserBets: (userId: number) => Promise<void>;
  validateBet: (betId: number) => Promise<void>;
}

export const useBetting = create<BettingState>((set, get) => ({
  selectedMatches: [],
  userBets: [],
  loading: false,
  error: null,
  addMatch: (match) => {
    set((state) => ({
      selectedMatches: [...state.selectedMatches, match],
      error: null,
    }));
  },
  removeMatch: (matchId) => {
    set((state) => ({
      selectedMatches: state.selectedMatches.filter(
        (match) => match.idEvent !== matchId
      ),
      error: null,
    }));
  },
  clearMatches: () => {
    set({ selectedMatches: [], error: null });
  },
  placeBet: async (userId: number, amount: number) => {
    const state = get();
    if (state.selectedMatches.length === 0) {
      set({ error: 'Please select at least one match' });
      return;
    }
    try {
      set({ loading: true, error: null });
      const totalOdds = state.selectedMatches.reduce(
        (acc, match) => acc * match.odds,
        1
      );
      await placeBet({
        userId,
        type: state.selectedMatches.length === 1 ? 'simple' : 'parlay',
        amount,
        odds: totalOdds,
      });
      set((state) => ({
        selectedMatches: [],
        loading: false,
      }));
    } catch (error) {
      set({
        error: 'Failed to place bet. Please try again.',
        loading: false,
      });
    }
  },
  fetchUserBets: async (userId: number) => {
    try {
      set({ loading: true, error: null });
      const bets = await getUserBets(userId);
      set({ userBets: bets, loading: false });
    } catch (error) {
      set({
        error: 'Failed to fetch user bets',
        loading: false,
      });
    }
  },
  validateBet: async (betId: number) => {
    try {
      set({ loading: true, error: null });
      await validateBet(betId);
      const state = get();
      const userId = state.userBets[0]?.userId;
      if (userId) {
        await state.fetchUserBets(userId);
      }
    } catch (error) {
      set({
        error: 'Failed to validate bet',
        loading: false,
      });
    }
  },
}));
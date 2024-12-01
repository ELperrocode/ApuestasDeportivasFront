"use client";

import { create } from "zustand";
import { Match, Bet } from "@/lib/types";
import {
  placeBet as apiPlaceBet,
  getUserBets,
  validateBets as apiValidateBets,
  getUserBalance,
} from "@/lib/api";
import { useAuth } from "./useAuth";

interface SelectedBet {
  matchId: string;
  match: Match;
  selection: string;
  odds: number;
}

interface BettingState {
  selectedBets: SelectedBet[];
  userBets: Bet[];
  loading: boolean;
  error: string | null;
  addBet: (match: Match, selection: "home" | "draw" | "away") => void;
  removeBet: (matchId: string, selection: string) => void;
  clearBets: () => void;
  placeBet: (userId: number, amount: number) => Promise<void>;
  fetchUserBets: (userId: number) => Promise<void>;
  validateBets: (userId: number) => Promise<void>;
}

export const useBetting = create<BettingState>((set, get) => ({
  selectedBets: [],
  userBets: [],
  loading: false,
  error: null,
  addBet: (match, selection) => {
    const odds =
      selection === "home"
        ? Number(match.homeOdds)
        : selection === "draw"
        ? Number(match.drawOdds)
        : Number(match.awayOdds);

    set((state) => ({
      selectedBets: [
        ...state.selectedBets.filter((bet) => bet.matchId !== match.idEvent),
        {
          matchId: match.idEvent,
          match,
          selection,
          odds,
        },
      ],
      error: null,
    }));
  },
  removeBet: (matchId, selection) => {
    set((state) => ({
      selectedBets: state.selectedBets.filter(
        (bet) => !(bet.matchId === matchId && bet.selection === selection)
      ),
      error: null,
    }));
  },
  clearBets: () => {
    set({ selectedBets: [], error: null });
  },
  placeBet: async (userId, amount) => {
    const state = get();
    if (state.selectedBets.length === 0) {
      set({ error: "Please select at least one bet" });
      return;
    }
    try {
      set({ loading: true, error: null });

      if (state.selectedBets.length === 1) {
        // Apuesta simple
        const bet = state.selectedBets[0];
        await apiPlaceBet({
          userId,
          type: "single",
          amount,
          odds: bet.odds,
          selection: bet.selection,
          matchId: bet.matchId,
        });
      } else {
        // Apuesta múltiple (parlay)
        const totalOdds = state.selectedBets.reduce(
          (acc, bet) => acc * bet.odds,
          1
        );
        await apiPlaceBet({
          userId,
          type: "multiple",
          amount,
          odds: totalOdds,
          selection: state.selectedBets.map((bet) => bet.selection).join(", "),
          matchId: state.selectedBets.map((bet) => bet.matchId).join(", "),
        });
      }
      console.log(state.selectedBets);
      const balance = await getUserBalance(userId);
      useAuth.getState().updateUserBalance(balance);

      set((state) => ({
        selectedBets: [],
        loading: false,
      }));
    } catch (error) {
      set({
        error: "Failed to place bet. Please try again.",
        loading: false,
      });
    }
  },

  fetchUserBets: async (userId) => {
    try {
      set({ loading: true, error: null });
      const bets = await getUserBets(userId);
      set({ userBets: bets, loading: false });
    } catch (error) {
      set({
        error: "Failed to fetch user bets",
        loading: false,
      });
    }
  },
  validateBets: async (userId) => {
    try {
      set({ loading: true, error: null });
      await apiValidateBets(userId);
      const balance = await getUserBalance(userId);
      useAuth.getState().updateUserBalance(balance);
      await get().fetchUserBets(userId);
      set({ loading: false });
    } catch (error) {
      set({
        error: "Failed to validate bets",
        loading: false,
      });
    }
  },
}));

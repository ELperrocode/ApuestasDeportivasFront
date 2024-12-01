import { Match } from '@/lib/types';

const API_URL = 'http://localhost:5123/api';

async function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export async function getLeagues() {
  try {
    const response = await fetch(`${API_URL}/partidos/leagues`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return [];
  }
}

export async function getUpcomingMatches(leagueId: string) {
  try {
    const response = await fetch(`${API_URL}/partidos/upcomingMatches/${leagueId}`);
    const matches = await handleResponse(response);
    return matches.map((match: Match) => ({
      ...match,
      homeOdds: (Math.random() * 3 + 1).toFixed(2),
      drawOdds: (Math.random() * 4 + 2).toFixed(2),
      awayOdds: (Math.random() * 3 + 1).toFixed(2),
    }));
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

export async function placeBet(data: {
  userId: number;
  type: string;
  amount: number;
  odds: number;
  selection: string;
  matchId: string;
}) {
  const response = await fetch(`${API_URL}/bets/place`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function getUserBets(userId: number) {
  try {
    const response = await fetch(`${API_URL}/bets/user/${userId}`);
    const bets = await handleResponse(response);
    return bets.sort((a: { date: string }, b: { date: string }) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching user bets:', error);
    return [];
  }
}

export async function validateBets(userId: number) {
  const response = await fetch(`${API_URL}/bets/validate/${userId}`, {
    method: 'POST',
  });
  return handleResponse(response);
}

export async function getUserBalance(userId: number) {
  const response = await fetch(`${API_URL}/bets/user/${userId}/balance`);
  return handleResponse(response);
}

export async function rechargeWallet(data: { userId: number; amount: number }) {
  const response = await fetch(`${API_URL}/users/recharge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
}

export async function login(credentials: { username: string; password: string }) {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}

export async function register(credentials: { username: string; password: string }) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
}
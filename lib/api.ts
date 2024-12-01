const API_URL = 'http://localhost:5123/api';

async function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  console.log('API Response:', data); // Debug log
  return data;
}

export async function getLeagues() {
  try {
    console.log('Fetching leagues from:', `${API_URL}/partidos/leagues`); // Debug log
    const response = await fetch(`${API_URL}/partidos/leagues`);
    const data = await handleResponse(response);
    console.log('Processed leagues data:', data); // Debug log
    return data;
  } catch (error) {
    console.error('Error fetching leagues:', error);
    return [];
  }
}

export async function getUpcomingMatches(leagueId: string) {
  try {
    console.log('Fetching matches for league:', leagueId); // Debug log
    const response = await fetch(`${API_URL}/partidos/upcomingMatches/${leagueId}`);
    const data = await handleResponse(response);
    console.log('Processed matches data:', data); // Debug log
    return data;
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
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching user bets:', error);
    return [];
  }
}

export async function validateBet(betId: number) {
  const response = await fetch(`${API_URL}/bets/validate/${betId}`);
  return handleResponse(response);
}

export async function login(credentials: { username: string; password: string }) {
  console.log('Login request:', credentials);
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  console.log('Login response:', response);
  return handleResponse(response);
}

export async function register(credentials: { username: string; password: string }) {
  console.log('Register request:', credentials);
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  console.log('Register response:', response);
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
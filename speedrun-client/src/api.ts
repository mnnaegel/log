// api.ts
import getSupabaseClient from './getSupabaseClient.ts';
import { Split, SplitState } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export type CreateSplitRequest = {
  name: string;
  startTime: number;
  pessimisticEstimate: number;
  state: SplitState;
};

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const { data: { session } } = await getSupabaseClient().auth.getSession();
  
  if (!session?.access_token) {
    throw new Error('No authentication token found');
  }

  const response = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function createSplit(split: CreateSplitRequest): Promise<Split> {
  return fetchWithAuth('/api/splits', {
    method: 'POST',
    body: JSON.stringify(split),
  });
}

export async function updateSplit(splitId: string, updates: Split): Promise<Split> {
  return fetchWithAuth(`/api/splits/${splitId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteSplit(splitId: string): Promise<void> {
  return fetchWithAuth(`/api/splits/${splitId}`, {
    method: 'DELETE',
  });
}

export async function getSplitsForDate(date: Date): Promise<Split[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return fetchWithAuth(
    `/api/splits?startTime=${startOfDay.getTime()}&endTime=${endOfDay.getTime()}`
  );
}
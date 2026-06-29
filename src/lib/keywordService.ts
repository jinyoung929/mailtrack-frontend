import type { SpamKeyword } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json() as Promise<T>
}

/** GET /api/keywords */
export async function fetchKeywords(): Promise<SpamKeyword[]> {
  return apiFetch<SpamKeyword[]>('/api/keywords')
}

/** POST /api/keywords */
export async function addKeyword(keyword: string): Promise<SpamKeyword> {
  return apiFetch<SpamKeyword>('/api/keywords', {
    method: 'POST',
    body: JSON.stringify({ keyword }),
  })
}

/** PATCH /api/keywords/:id */
export async function toggleKeyword(id: number, is_active: boolean): Promise<SpamKeyword> {
  return apiFetch<SpamKeyword>(`/api/keywords/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active }),
  })
}

/** DELETE /api/keywords/:id */
export async function deleteKeyword(id: number): Promise<void> {
  await apiFetch<{ message: string }>(`/api/keywords/${id}`, { method: 'DELETE' })
}

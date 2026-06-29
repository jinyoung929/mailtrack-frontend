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

// localStorage에 키워드 동기화
function syncToStorage(keywords: SpamKeyword[]) {
  localStorage.setItem('spam_keywords', JSON.stringify(keywords))
}

/** GET /api/keywords */
export async function fetchKeywords(): Promise<SpamKeyword[]> {
  const keywords = await apiFetch<SpamKeyword[]>('/api/keywords')
  syncToStorage(keywords)
  return keywords
}

/** POST /api/keywords */
export async function addKeyword(keyword: string): Promise<SpamKeyword> {
  const newKeyword = await apiFetch<SpamKeyword>('/api/keywords', {
    method: 'POST',
    body: JSON.stringify({ keyword }),
  })
  const stored = JSON.parse(localStorage.getItem('spam_keywords') || '[]')
  syncToStorage([newKeyword, ...stored])
  return newKeyword
}

/** PATCH /api/keywords/:id */
export async function toggleKeyword(id: number, is_active: boolean): Promise<SpamKeyword> {
  const updated = await apiFetch<SpamKeyword>(`/api/keywords/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ is_active }),
  })
  const stored = JSON.parse(localStorage.getItem('spam_keywords') || '[]')
  syncToStorage(stored.map((k: SpamKeyword) => k.id === id ? { ...k, is_active } : k))
  return updated
}

/** DELETE /api/keywords/:id */
export async function deleteKeyword(id: number): Promise<void> {
  await apiFetch<{ message: string }>(`/api/keywords/${id}`, { method: 'DELETE' })
  const stored = JSON.parse(localStorage.getItem('spam_keywords') || '[]')
  syncToStorage(stored.filter((k: SpamKeyword) => k.id !== id))
}

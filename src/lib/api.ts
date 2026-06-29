import type { AnalysisResult } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`API ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

/**
 * POST /api/analyze
 * 활성 스팸 키워드도 함께 전송해서 Gemini 프롬프트에 반영
 */
export async function analyzeMail(content: string): Promise<AnalysisResult> {
  // localStorage에서 활성 키워드 가져오기
  const stored = localStorage.getItem('spam_keywords')
  const keywords: string[] = stored
    ? JSON.parse(stored)
        .filter((k: any) => k.is_active)
        .map((k: any) => k.keyword)
    : []

  return apiFetch<AnalysisResult>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ content, keywords }),
  })
}

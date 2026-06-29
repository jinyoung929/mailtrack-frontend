import type { AnalysisResult } from '../types'

// 환경변수로 API URL 관리 (로컬: localhost:8000, 배포: Render URL)
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// 공통 fetch 래퍼 — 에러 처리 일원화
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
 * 메일 본문을 Gemini AI로 분석해 보안 등급·요약·다크 데이터를 반환합니다.
 * DB 저장은 하지 않으며, 결과만 즉시 반환합니다.
 */
export async function analyzeMail(content: string): Promise<AnalysisResult> {
  return apiFetch<AnalysisResult>('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

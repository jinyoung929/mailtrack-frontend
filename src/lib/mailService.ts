import type { MailRecord, SecurityLevel } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(`API ${res.status}`)
  return res.json() as Promise<T>
}

/** GET /api/mails — 전체 메일 목록 (최신순) */
export async function fetchMails(): Promise<MailRecord[]> {
  return apiFetch<MailRecord[]>('/api/mails')
}

/** GET /api/mails/problems — 위험/주의/다크 메일만 */
export async function fetchProblematicMails(): Promise<MailRecord[]> {
  return apiFetch<MailRecord[]>('/api/mails/problems')
}

/** POST /api/mails — 분석 결과를 DB에 저장 */
export async function saveMail(payload: {
  content: string
  subject?: string
  is_dark: boolean
  dark_reason?: string
  security_level: SecurityLevel
}): Promise<MailRecord> {
  return apiFetch<MailRecord>('/api/mails', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

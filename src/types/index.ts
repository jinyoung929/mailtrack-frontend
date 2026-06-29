// ── 라우팅 ────────────────────────────────────────────────
export type Page = 'login' | 'dashboard' | 'inbox' | 'security' | 'darkdata' | 'smartfilter'

// ── 보안 등급 ──────────────────────────────────────────────
export type SecurityLevel = 'safe' | 'warn' | 'danger'

// ── AI 분석 결과 ───────────────────────────────────────────
export interface SecurityIssue {
  type: SecurityLevel
  title: string
  desc: string
}

export interface SecurityInfo {
  level: SecurityLevel
  issues: SecurityIssue[]
}

export interface DarkDataItem {
  label: string
  reason: string
}

export interface CalendarEvent {
  title: string
  date: string
  time: string | null
  location: string | null
}

export interface AnalysisResult {
  subject: string
  summary: string
  security: SecurityInfo
  darkdata: DarkDataItem[]
  calendar: CalendarEvent[]
}

// ── DB 레코드 ──────────────────────────────────────────────
export interface MailRecord {
  id: number
  subject: string | null
  sender?: string | null
  content: string
  is_dark: boolean
  dark_reason: string | null
  security_level: SecurityLevel
  user_id?: number | null
  created_at: string
}

// ── 스팸 키워드 ────────────────────────────────────────────
export interface SpamKeyword {
  id: number
  keyword: string
  is_active: boolean
  created_at: string
}

// ── 대시보드 통계 ──────────────────────────────────────────
export interface SessionStats {
  total: number
  dark: number
  alerts: number
}

// ── 네비게이션 ─────────────────────────────────────────────
export interface NavItem {
  label: string
  page: Page
  icon: React.ReactNode
}

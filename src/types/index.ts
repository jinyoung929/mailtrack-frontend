// ── 라우팅 ────────────────────────────────────────────────
export type Page = 'login' | 'dashboard' | 'inbox' | 'security' | 'darkdata' | 'smartfilter'

// ── 보안 등급 ──────────────────────────────────────────────
export type SecurityLevel = 'safe' | 'warn' | 'danger'

// ── AI 분석 결과 (POST /api/analyze 응답) ─────────────────
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

export interface AnalysisResult {
  subject: string
  summary: string
  security: SecurityInfo
  darkdata: DarkDataItem[]
}

// ── DB 레코드 (GET /api/mails 응답) ───────────────────────
export interface MailRecord {
  id: number
  subject: string | null
  sender?: string | null
  content: string
  is_dark: boolean
  dark_reason: string | null
  security_level: SecurityLevel
  user_id?: number | null
  created_at: string   // ISO 8601
}

// ── 스팸 키워드 (GET /api/keywords 응답) ──────────────────
export interface SpamKeyword {
  id: number
  keyword: string
  is_active: boolean
  created_at: string
}

// ── 대시보드 통계 (세션 로컬 상태) ────────────────────────
export interface SessionStats {
  total: number
  dark: number
  alerts: number
}

// ── 네비게이션 아이템 ──────────────────────────────────────
export interface NavItem {
  label: string
  page: Page
  icon: React.ReactNode
}
